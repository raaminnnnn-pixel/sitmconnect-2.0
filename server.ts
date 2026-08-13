import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import { users, problemReports } from './src/db/schema.ts';
import { eq } from 'drizzle-orm';
import { adminAuth } from './src/lib/firebase-admin.ts';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Outing Permission Email Generation Endpoint
  app.post('/api/ai/generate-outing-email', async (req, res) => {
    try {
      const { studentName, hostelRoom, purpose, goingDate, goingTime, returnDate, returnTime, parentEmail } = req.body;

      const defaultSubject = `Outing Permission Request: ${studentName || 'Student'} (${hostelRoom || 'Hostel'})`;
      const defaultBody = `Respected Chief Warden Sir,\n\nI am ${studentName || 'a resident student'}, residing in ${hostelRoom || 'SITM Hostel'}. I kindly request permission to leave campus for the following outing:\n\n• Purpose: ${purpose || 'Personal work'}\n• Departure: ${goingDate || 'Today'} at ${goingTime || '17:30'}\n• Expected Return: ${returnDate || 'Today'} at ${returnTime || '20:30'}\n\nMy parent/guardian (${parentEmail || 'parent@gmail.com'}) is CC'd on this email for verification and consent.\n\nThank you for your consideration.\n\nYours sincerely,\n${studentName || 'Student'}\nScholars Institute of Technology & Management`;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          subject: defaultSubject,
          body: defaultBody,
        });
      }

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `You are an AI assistant for a college hostel portal (Scholars Institute of Technology & Management). Write a polite, formal email request from a hostel student to the Chief Warden requesting permission for an outing.

Student Details:
- Name: ${studentName}
- Hostel Room: ${hostelRoom}
- Outing Purpose: ${purpose}
- Departure: ${goingDate} at ${goingTime}
- Expected Return: ${returnDate} at ${returnTime}
- Parent Email CC: ${parentEmail}

Return ONLY valid JSON with two keys:
"subject": a concise formal email subject line
"body": the complete formal body of the email addressed to Chief Warden`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({
            subject: parsed.subject || defaultSubject,
            body: parsed.body || defaultBody,
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini API call fallback:', geminiErr);
      }

      return res.json({
        subject: defaultSubject,
        body: defaultBody,
      });
    } catch (err: any) {
      console.error('AI Outing Email generation error:', err);
      res.json({
        subject: `Outing Permission Request: ${req.body?.studentName || 'Student'}`,
        body: `Respected Chief Warden Sir,\n\nI request outing permission for ${req.body?.purpose || 'personal work'} from ${req.body?.goingDate || ''} ${req.body?.goingTime || ''} to ${req.body?.returnDate || ''} ${req.body?.returnTime || ''}.\n\nThank you,\n${req.body?.studentName || 'Student'}`,
      });
    }
  });

  // User Auth & Profile Sync Endpoint (Cloud SQL + Firebase)
  app.post('/api/users/sync', async (req, res) => {
    try {
      const { uid, email, displayName, role, department, phone, residenceType, roomNo, floorNo, employeeId, designation } = req.body;
      if (!uid || !email) {
        return res.status(400).json({ error: 'Missing required uid or email' });
      }

      // Upsert into Cloud SQL users table
      if (process.env.SQL_HOST && process.env.SQL_USER) {
        try {
          await db.insert(users)
            .values({
              uid,
              email,
              displayName: displayName || 'User',
              role: role || 'student',
              department: department || '',
              phone: phone || '',
              residenceType: residenceType || '',
              roomNo: roomNo || '',
              floorNo: floorNo || '',
              employeeId: employeeId || '',
              designation: designation || '',
            })
            .onConflictDoUpdate({
              target: users.uid,
              set: {
                email,
                displayName: displayName || 'User',
                role: role || 'student',
                department: department || '',
                phone: phone || '',
                residenceType: residenceType || '',
                roomNo: roomNo || '',
                floorNo: floorNo || '',
                employeeId: employeeId || '',
                designation: designation || '',
              },
            });
        } catch (sqlErr) {
          console.error('Cloud SQL sync error (non-blocking):', sqlErr);
        }
      }

      res.json({ status: 'success', uid });
    } catch (err: any) {
      console.error('Failed to sync user profile:', err);
      res.status(500).json({ error: err.message || 'Server error syncing user profile' });
    }
  });

  // Fetch all problem reports from Cloud SQL (with fallback)
  app.get('/api/reports', async (req, res) => {
    try {
      if (process.env.SQL_HOST && process.env.SQL_USER) {
        const reports = await db.select().from(problemReports);
        return res.json(reports);
      }
      res.json([]);
    } catch (err: any) {
      console.error('Failed to fetch reports from Cloud SQL:', err);
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  });

  // Sync new problem report to Cloud SQL
  app.post('/api/reports', async (req, res) => {
    try {
      const report = req.body;
      if (process.env.SQL_HOST && process.env.SQL_USER) {
        await db.insert(problemReports).values({
          reportId: report.id,
          title: report.title,
          category: report.category,
          location: report.location,
          description: report.description,
          priority: report.priority,
          status: report.status || 'Reported',
          reportedBy: report.reportedBy || 'anonymous',
          reporterName: report.reporterName || 'Anonymous Student',
          reporterRole: report.reporterRole || 'student',
          reporterDept: report.reporterDept || '',
          reporterPhone: report.reporterPhone || '',
          residenceType: report.residenceType || '',
          roomNo: report.roomNo || '',
          floorNo: report.floorNo || '',
          upvotes: report.upvotes || 0,
          assignedTeam: report.assignedTeam || '',
          imageUrl: report.imageUrl || '',
          isAnonymous: report.isAnonymous || false,
        }).onConflictDoNothing();
      }
      res.json({ status: 'success', reportId: report.id });
    } catch (err: any) {
      console.error('Failed to save report to Cloud SQL:', err);
      res.status(500).json({ error: 'Failed to save report' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
