# ครูไหมจี้ · Performance Agreement 2569

เว็บไซต์ PA ตำแหน่งครู นางสาวเวธกา จันทร์ศรีสุคต โรงเรียนโคกคอนวิทยาคม

## เปิดดู
เปิด index.html ได้โดยตรง หรือดูตัวอย่างในเครื่องที่ http://127.0.0.1:8765
เพลงเริ่มเมื่อผู้ชมกดเปิดเพลง จากไฟล์ audio/background-music.mp3 และเล่นวน ไม่ต้องเชื่อมต่อ YouTube

## ฉบับแก้ไข 13 กันยายน 2569
- ภาพข้อมูลทั่วไปจากไฟล์ ChatGPT Image 12 ก.ย. 2569 21_44_00.png ที่แนบ
- คทาวิเศษพร้อมดาววิบวับตกตามเมาส์ และงดเอฟเฟกต์เมื่อผู้ใช้ตั้งค่าลดการเคลื่อนไหว
- ตราโรงเรียนบนหน้าปกเป็นภาพ RGBA พื้นหลังโปร่งใสที่แยกจาก PDF หน้า 27 วัตถุภาพ 283 เป็นตราแบบเดียวกับภาพแนบ
- ภาพจากรายงานผลการปฏิบัติงาน.pdf ครบ 143 ภาพ: ด้าน 1 หน้า 4–13 จำนวน 64 ภาพ; ด้าน 2 หน้า 14–20 จำนวน 41 ภาพ; ด้าน 3 หน้า 21–28 จำนวน 38 ภาพ
- รวม QR ภาพเอกสาร ภาพบุคคล และภาพซ้ำที่ปรากฏในแต่ละด้าน ไม่นับกรอบพื้นหลังและหัว/ท้ายกระดาษ
- รูปที่หมุนใน PDF ได้คืนทิศทางตามหน้าเอกสาร
- evidence-manifest.json ระบุหน้า วัตถุภาพ และชื่อไฟล์เพื่อสอบทานความครบถ้วน
- ประเด็นท้าทายใช้ภาพจากด้าน 1 ลำดับ 14, 43, 62 เป็นภาพประกอบการจัดกิจกรรม ไม่ใช่หลักฐานยืนยันผลสัมฤทธิ์
- ตัวเลข 75% และ 80% เป็นผลลัพธ์ที่คาดหวังตามรายงาน

## ตรวจสอบ
ภาพทั้งหมดโหลดได้ ปุ่มเพลงเล่น/หยุดได้และตั้งค่าเล่นวน เปิดภาพขยายได้ ทั้งจอใหญ่และมือถือไม่พบการเลื่อนล้นแนวนอนจากการทดสอบ

## สถานะเผยแพร่
ยังไม่ได้อัปโหลด GitHub หรือเผยแพร่สาธารณะ รอครูไหมจี้อนุมัติ
หากเผยแพร่ GitHub Pages ให้อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ โดย index.html อยู่ที่ราก repository

## Update 2026-09-14
- Latest user-provided school emblem applied to all standalone emblem placements; the supplied raster includes a checkerboard.
- Matching checkmarks added for items 1.7 and 1.8.
- Student AR exponent game linked from area 2 to the user-provided Gemini share.
- User MOV converted to H.264/AAC MP4 (39.9 seconds) for the opening dialog and challenge section.
- Opening dialog supports close button, Escape, native video controls and sound toggle.
- Ambient background movement respects reduced-motion settings.
- Not uploaded to GitHub.


## 2026-09-14: sequential PA sections and mathematical background
Each area now contains its description followed by its complete gallery (64, 41, 38 images). The welcome video autoplays muted and loops until dismissed; sound is visitor-controlled. Mathematical canvas includes formulas, networks, sine waves and rotating polygons, with pause and reduced-motion support.

Logo: img/school-emblem-transparent.png. Created with built-in Imagegen; verified RGBA alpha 0–255. Prompt: Remove the entire gray-white checkerboard background, use genuine transparent alpha, preserve the school emblem, Thai lettering, laurel, base and original colors.

## Mathematical scene and audible welcome update
The welcome film first requests autoplay with sound at 70% volume. If the browser blocks audible autoplay, it continues muted and offers a direct sound button. It loops until dismissed. Verified both autoplay policy paths in Chrome.
The background uses a 1600 x 900 design coordinate system: floating mathematical symbols, progressively drawn parabola and sine graphs, moving networks, perspective-projected cubes, silver particles/light trails and a moving perspective grid. The center is softly masked for reading. Pause and reduced-motion controls remain available.

## Student work links (area 2)
Moved the AR game after all 41 area-2 photographs. Added the four supplied TikTok links after the game. Two Padlet cards appear within the area-2 gallery; their embeds load on request and direct external links remain available. External content availability and access permissions depend on TikTok and Padlet.

## 2026-09-15 welcome audio and classroom link
Popup requests audible autoplay, with a muted fallback only when browser policy blocks it. A real visitor gesture can unlock blocked audio. Closing the popup starts the looping hero greeting with sound, with a mute control; manual mute is preserved. Tested allowed and blocked autoplay policies in Chrome, including transition, mute preservation and mobile overflow. Added Teacher Smart Classroom Page link at the end of the AI classroom section; destination content was not accessible to the web inspection tool.
