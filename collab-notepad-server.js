const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
// แก้ไข: ใช้ process.env.PORT เพื่อให้รองรับการ Deploy บน Hosting Service
const PORT = process.env.PORT || 3000; 

// Path ไปยังไฟล์ JSON ฐานข้อมูล: 
// ใช้ path.join(__dirname, 'messages.json') เพื่อให้ชี้ไปยังไฟล์ในโฟลเดอร์เดียวกันกับเซิร์ฟเวอร์
const DB_PATH = path.join(__dirname, 'messages.json');

// Middleware: เพื่อให้ Express อ่านข้อมูลที่เป็น JSON ที่ส่งมาจาก Frontend ได้
app.use(express.json());

// Middleware: เพื่อให้ Express เสิร์ฟไฟล์ HTML, CSS, JS ในโฟลเดอร์ปัจจุบัน (Frontend)
app.use(express.static(__dirname)); 

// --- API Endpoint 1: GET /api/message (สำหรับดึงข้อความล่าสุด) ---
app.get('/api/message', (req, res) => {
    try {
        // อ่านข้อมูลจากไฟล์ messages.json 
        const data = fs.readFileSync(DB_PATH, 'utf8');
        const message = JSON.parse(data);
        res.json(message); // ส่งข้อความกลับไปเป็น JSON
    } catch (error) {
        // Log ข้อผิดพลาดจริง ๆ ใน Console เพื่อให้ง่ายต่อการ Debug
        console.error("Error reading message:", error);
        // หากไฟล์มีปัญหา (เช่น ENOENT) ให้ส่งข้อความเริ่มต้นกลับไป
        res.status(500).json({ text: "ไม่สามารถโหลดข้อความได้: กรุณาตรวจสอบไฟล์ messages.json" });
    }
});

// --- API Endpoint 2: POST /api/message (สำหรับบันทึก/แก้ไขข้อความ) ---
app.post('/api/message', (req, res) => {
    const { text } = req.body; // ดึงค่า 'text' ที่ส่งมาจาก Frontend
    
    if (!text) {
        return res.status(400).send({ error: 'ไม่พบข้อความที่ส่งมา' });
    }

    const newMessage = { text: text };
    
    try {
        // บันทึกข้อความใหม่ลงในไฟล์ JSON
        // ใช้ null, 2 เพื่อจัดรูปแบบ JSON ให้อ่านง่ายขึ้น
        fs.writeFileSync(DB_PATH, JSON.stringify(newMessage, null, 2), 'utf8');
        res.status(200).send({ success: true, message: 'บันทึกสำเร็จ' });
    } catch (error) {
        console.error("Error writing message:", error);
        res.status(500).send({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`เซิร์ฟเวอร์กำลังทำงานที่: ${PORT}`);
    // แสดง URL ในรูปแบบที่ถูกต้องเมื่อรันบนเครื่อง Local
    if (PORT === 3000) {
        console.log(`เข้าใช้งานได้ที่: http://localhost:${PORT}`);
    }
    console.log('พร้อมใช้งานกระดานข้อความต่อกันแล้ว!');
});