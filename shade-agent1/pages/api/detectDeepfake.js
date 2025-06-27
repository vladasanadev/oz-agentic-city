import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = formidable({
            uploadDir: './tmp',
            keepExtensions: true,
            maxFileSize: 50 * 1024 * 1024, // 50MB limit
        });

        const [fields, files] = await form.parse(req);
        const file = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'video/mov', 'video/avi', 'video/webm'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({ 
                error: 'Unsupported file type',
                supportedTypes: ['JPG', 'PNG', 'MP4', 'MOV', 'AVI', 'WebM']
            });
        }

        console.log(`📁 Processing file: ${file.originalFilename} (${file.mimetype}, ${file.size} bytes)`);

        // Read file data
        const fileBuffer = fs.readFileSync(file.filepath);
        const fileData = fileBuffer.toString('base64');

        // Send to mock TEE service for processing
        const teeResponse = await fetch('http://localhost:3140/api/process-tee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fileData,
                fileName: file.originalFilename,
                fileType: file.mimetype,
            }),
        });

        if (!teeResponse.ok) {
            throw new Error(`TEE processing failed: ${teeResponse.status}`);
        }

        const teeResult = await teeResponse.json();

        // Clean up uploaded file
        try {
            fs.unlinkSync(file.filepath);
        } catch (cleanupError) {
            console.warn('Failed to cleanup file:', cleanupError);
        }

        if (!teeResult.success) {
            throw new Error(teeResult.error || 'TEE processing failed');
        }

        console.log(`✅ Detection complete: ${teeResult.result.isDeepfake ? 'DEEPFAKE' : 'AUTHENTIC'}`);

        res.status(200).json({
            success: true,
            result: {
                isDeepfake: teeResult.result.isDeepfake,
                confidence: teeResult.result.confidence,
                algorithm: teeResult.result.algorithm,
                processingTime: teeResult.result.processingTime,
                hash: teeResult.result.hash,
                teeSignature: teeResult.result.teeSignature,
                fileName: file.originalFilename,
                fileSize: file.size,
                fileType: file.mimetype,
                timestamp: teeResult.result.timestamp,
                teeWorker: teeResult.result.teeWorker
            }
        });

    } catch (error) {
        console.error('Deepfake detection error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Detection failed',
            details: error.message,
            suggestion: 'Make sure the Mock TEE Service is running on port 3140'
        });
    }
} 