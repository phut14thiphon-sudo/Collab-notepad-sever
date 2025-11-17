const messageTextarea = document.getElementById('message-content');

// 1. ฟังก์ชันดึงข้อความจากเซิร์ฟเวอร์มาแสดง
async function fetchMessage() {
    try {
        // ดึงข้อมูลจาก API /api/message
        const response = await fetch('/api/message');
        const data = await response.json();
        
        // นำข้อความที่ดึงมาได้ไปใส่ใน textarea
        if (data && data.text) {
            messageTextarea.value = data.text;
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อความ:', error);
        messageTextarea.value = 'ไม่สามารถโหลดข้อความล่าสุดได้ ลองใหม่อีกครั้ง';
    }
}

// 2. ฟังก์ชันบันทึกข้อความไปยังเซิร์ฟเวอร์
async function saveMessage() {
    const newMessage = messageTextarea.value;
    
    try {
        const response = await fetch('/api/message', {
            method: 'POST', // ใช้วิธี POST เพื่อส่งข้อมูลใหม่
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: newMessage })
        });

        if (response.ok) {
            alert('บันทึกข้อความเรียบร้อยแล้ว!');
            // ไม่ต้องทำอะไรอีก เพราะข้อความที่บันทึกไว้ก็คือข้อความใน textarea
        } else {
            alert('บันทึกข้อความล้มเหลว: ' + response.statusText);
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการบันทึก:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
}

// โหลดข้อความทันทีที่หน้าเว็บเปิด
fetchMessage();