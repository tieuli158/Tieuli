<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <!-- Viewport chuẩn cho Mobile: Chặn zoom, fit màn hình -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    
    <!-- CẤU HÌNH WEB APP (FULL MÀN HÌNH - iOS/Android) -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="MMLive Tools">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="theme-color" content="#0f0c29">
    
    <!-- ICON APP (Hiển thị khi thêm vào màn hình chính) -->
    <link rel="apple-touch-icon" href="https://ui-avatars.com/api/?name=MM&background=0D8ABC&color=fff&size=512&font-size=0.5">
    <link rel="icon" type="image/png" href="https://ui-avatars.com/api/?name=MM&background=0D8ABC&color=fff&size=512&font-size=0.5">

    <title>Long Nguyễn - Tools MMLive (Mobile Layout Fixed)</title>
    
    <!-- Thư viện MD5 inline - GIỮ NGUYÊN 100% -->
    <script>
        // MD5 implementation
        function md5(string) {
            function rotateLeft(value, amount) {
                var lbits = value << amount;
                var rbits = value >>> (32 - amount);
                return (lbits | rbits) & 0xFFFFFFFF;
            }

            function addUnsigned(lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
                    return (lResult ^ lX8 ^ lY8);
                }
            }

            function F(x, y, z) { return (x & y) | ((~x) & z); }
            function G(x, y, z) { return (x & z) | (y & (~z)); }
            function H(x, y, z) { return (x ^ y ^ z); }
            function I(x, y, z) { return (y ^ (x | (~z))); }

            function FF(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            }

            function GG(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            }

            function HH(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            }

            function II(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            }

            function convertToWordArray(string) {
                var lWordCount;
                var lMessageLength = string.length;
                var lNumberOfWords_temp1 = lMessageLength + 8;
                var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                var lWordArray = Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount++;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            }

            function wordToHex(lValue) {
                var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    WordToHexValue_temp = "0" + lByte.toString(16);
                    WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
                }
                return WordToHexValue;
            }

            var x = Array();
            var k, AA, BB, CC, DD, a, b, c, d;
            var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
            var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
            var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
            var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }

            x = convertToWordArray(utftext);
            a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

            for (k = 0; k < x.length; k += 16) {
                AA = a; BB = b; CC = c; DD = d;
                a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = addUnsigned(a, AA);
                b = addUnsigned(b, BB);
                c = addUnsigned(c, CC);
                d = addUnsigned(d, DD);
            }

            return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
        }
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        :root {
            --primary-gradient: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
            --glass-bg: rgba(255, 255, 255, 0.85);
            --glass-border: rgba(255, 255, 255, 0.6);
            --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
            --card-hover-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            --text-main: #2c3e50;
            --text-secondary: #596275;
            --accent-color: #5758BB;
            --success-color: #009432;
            --danger-color: #EA2027;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            outline: none;
            /* Tắt highlight màu xanh khi tap trên mobile */
            -webkit-tap-highlight-color: transparent;
        }

        html {
            width: 100%;
        }

        body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            background: var(--primary-gradient);
            background-attachment: fixed;
            min-height: 100vh;
            width: 100%;
            padding: 20px;
            color: var(--text-main);
            overflow-x: hidden; 
            /* Fix padding cho chế độ Web App trên iPhone tai thỏ */
            padding-top: max(20px, env(safe-area-inset-top));
            padding-bottom: max(20px, env(safe-area-inset-bottom));
        }

        /* PREMIUM LAYOUT - 2 COLUMNS ON DESKTOP */
        .main-container {
            display: grid;
            grid-template-columns: 380px 1fr; /* Default desktop */
            gap: 25px;
            width: 100%;
            max-width: 1440px;
            margin: 0 auto;
            align-items: start;
            min-height: calc(100vh - 60px);
        }

        /* GLASSMORPHISM CARD STYLE BASE */
        .glass-panel {
            background: var(--glass-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: 20px;
            border: 1px solid var(--glass-border);
            box-shadow: var(--glass-shadow);
            padding: 25px;
            transition: all 0.3s ease;
        }

        /* LOGIN STATE - COMPACT - KHẮC PHỤC LOAD CHẬM: ẨN MẶC ĐỊNH */
        .login-container {
            grid-column: 1 / -1; 
            max-width: 400px;
            margin: 10vh auto;
            padding: 30px;
            height: fit-content;
            width: 100%;
            /* QUAN TRỌNG: Ẩn ngay từ đầu để tránh chớp nháy */
            display: none; 
        }

        .login-header h1 {
            color: var(--text-main);
            font-size: 1.8rem;
            margin-bottom: 10px;
            font-weight: 800;
            letter-spacing: -1px;
            background: -webkit-linear-gradient(45deg, #302b63, #24243e);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .login-header p {
            font-size: 0.9rem;
            margin-bottom: 20px;
        }

        /* SIDEBAR (LEFT) */
        .sidebar-container {
            display: none;
            height: fit-content;
            position: sticky;
            top: 20px; 
        }

        /* IDOL CONTAINER (RIGHT) */
        .idol-container {
            display: none;
            min-height: 100%; 
            display: flex;
            flex-direction: column;
        }

        /* FORM ELEMENTS */
        .form-group { margin-bottom: 20px; position: relative; }
        .form-group label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 6px;
            display: block;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid rgba(0,0,0,0.08);
            border-radius: 12px;
            font-size: 0.95rem;
            background: rgba(255,255,255,0.8);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            color: #333;
        }

        .form-group input:focus {
            border-color: var(--accent-color);
            box-shadow: 0 4px 15px rgba(87, 88, 187, 0.15);
            background: #fff;
        }

        /* STYLE CHO NÚT XOÁ (X) NẰM TRONG INPUT */
        .clear-input-btn {
            position: absolute;
            right: 30px; /* Dời sang trái để nhường chỗ cho mũi tên */
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            color: #b2bec3; /* Xám nhạt mặc định */
            font-size: 1.1rem;
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            z-index: 10;
        }

        .clear-input-btn:hover {
            color: #ff4757; /* Đỏ khi hover */
            background: rgba(255, 71, 87, 0.1);
        }

        .login-btn, .search-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            text-transform: uppercase;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
        }
        
        .login-btn { padding: 12px; width: 100%; margin-top: 5px; }
        
        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }

        /* NEW DARK TRANSLUCENT BUTTON STYLES (V11) */
        
        /* Shared Styles for All Tool Buttons */
        .tool-btn, .quick-btn {
            border-width: 2px;
            border-style: solid;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            font-weight: 700;
            text-transform: uppercase;
            box-shadow: none;
            position: relative;
            overflow: hidden;
        }

        .tool-btn:hover, .quick-btn:hover {
            transform: translateY(-2px);
        }

        /* QUICK SELECT BUTTONS - DARK TRANSLUCENT PILLS (GRID LAYOUT) */
        .quick-select-group {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-top: 15px;
        }

        .quick-btn {
            padding: 8px 0;
            text-align: center;
            border-radius: 50px;
            font-size: 0.85rem;
            width: 100%;
            letter-spacing: 0.5px;
        }

        /* + 100: Cyan Style */
        .btn-cyan {
            background: rgba(30, 30, 40, 0.6);
            border-color: #00d2d3;
            color: #ffffff;
        }
        .btn-cyan:hover {
            background: rgba(0, 210, 211, 0.15); 
            box-shadow: 0 0 15px rgba(0, 210, 211, 0.4);
            text-shadow: 0 0 5px rgba(0, 210, 211, 0.5);
        }

        /* + 200: Green Style */
        .btn-green {
            background: rgba(30, 30, 40, 0.6);
            border-color: #2ecc71;
            color: #ffffff;
        }
        .btn-green:hover {
            background: rgba(46, 204, 113, 0.15);
            box-shadow: 0 0 15px rgba(46, 204, 113, 0.4);
            text-shadow: 0 0 5px rgba(46, 204, 113, 0.5);
        }

        /* + 300: Purple Style */
        .btn-purple {
            background: rgba(30, 30, 40, 0.6);
            border-color: #9b59b6;
            color: #ffffff;
        }
        .btn-purple:hover {
            background: rgba(155, 89, 182, 0.15);
            box-shadow: 0 0 15px rgba(155, 89, 182, 0.4);
            text-shadow: 0 0 5px rgba(155, 89, 182, 0.5);
        }

        /* + 1000: Orange/Gold Style */
        .btn-orange {
            background: rgba(30, 30, 40, 0.6);
            border-color: #f1c40f;
            color: #ffffff;
        }
        .btn-orange:hover {
            background: rgba(241, 196, 15, 0.15);
            box-shadow: 0 0 15px rgba(241, 196, 15, 0.4);
            text-shadow: 0 0 5px rgba(241, 196, 15, 0.5);
        }

        /* MAIN ACTION BUTTONS - DARK TRANSLUCENT STYLE */
        .tool-btn {
            border-radius: 12px;
            font-size: 0.9rem;
            letter-spacing: 1px;
            width: 100%;
        }

        /* Buff View: Green/Teal Neon */
        .glow-green {
            background: rgba(30, 30, 40, 0.6);
            border-color: #0be881;
            color: #ffffff;
        }
        .glow-green:hover {
            background: rgba(11, 232, 129, 0.15);
            box-shadow: 0 0 15px rgba(11, 232, 129, 0.4);
            text-shadow: 0 0 5px rgba(11, 232, 129, 0.5);
        }

        /* Phá Idol: Red Neon */
        .glow-red {
            background: rgba(30, 30, 40, 0.6);
            border-color: #ff3f34;
            color: #ffffff;
        }
        .glow-red:hover {
            background: rgba(255, 63, 52, 0.15);
            box-shadow: 0 0 15px rgba(255, 63, 52, 0.4);
            text-shadow: 0 0 5px rgba(255, 63, 52, 0.5);
        }

        /* Đăng Xuất: Gray Neon */
        .glow-white {
            background: rgba(30, 30, 40, 0.6);
            border-color: #bdc3c7;
            color: #ffffff;
        }
        .glow-white:hover {
            background: rgba(189, 195, 199, 0.15);
            border-color: #fff;
            color: #fff;
            box-shadow: 0 0 15px rgba(236, 240, 241, 0.4);
        }

        /* USER PROFILE STYLES */
        .profile-card-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px dashed rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }

        .avatar-glow {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            border: 4px solid #fff;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            object-fit: cover;
            margin-bottom: 15px;
        }

        .stat-badge {
            display: inline-flex;
            align-items: center;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 700;
            color: white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        
        .info-label { font-size: 0.9rem; color: var(--text-secondary); font-weight: 500; }
        .info-value { font-family: 'Consolas', monospace; font-weight: 700; color: var(--text-main); }

        /* IDOL GRID & SEARCH */
        .idol-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            flex-wrap: wrap; /* Cho phép xuống dòng trên mobile */
            gap: 10px;
        }

        .idol-header h2 { font-size: 1.5rem; font-weight: 800; color: var(--text-main); }
        
        .search-wrapper {
            background: white;
            padding: 8px;
            border-radius: 12px;
            display: flex;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            border: 1px solid rgba(0,0,0,0.05);
            flex-grow: 1; /* Tự co giãn trên mobile */
        }

        .search-input {
            border: none;
            padding: 10px 15px;
            flex-grow: 1;
            font-size: 0.95rem;
            border-radius: 8px;
            min-width: 0; /* Cho phép input thu nhỏ trên màn hình bé */
        }

        .idol-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* Desktop default */
            gap: 20px;
            max-height: 80vh;
            overflow-y: auto;
            padding: 10px 5px;
            min-height: 300px; /* Thêm chiều cao tối thiểu để tránh bị ẩn */
            padding-bottom: 100px; /* Thêm padding dưới cùng để không bị che bởi bottom nav */
        }

        .idol-card {
            background: white;
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }

        .idol-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.1);
            border-color: rgba(102, 126, 234, 0.3);
        }

        .idol-card.selected {
            border-color: var(--success-color);
            background: linear-gradient(to bottom right, #fff, #f0fff4);
            box-shadow: 0 10px 25px rgba(33, 150, 243, 0.15);
        }

        .idol-card.selected::after {
            content: '✔';
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--success-color);
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .idol-avatar-img {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-bottom: 12px;
        }

        .idol-name { font-weight: 700; color: #333; margin-bottom: 4px; font-size: 1.05rem; }
        .idol-desc { font-size: 0.8rem; color: #888; margin-bottom: 10px; line-height: 1.4; height: 2.4em; overflow: hidden;}
        
        .status-pill {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.7rem;
            font-weight: 800;
            text-transform: uppercase;
        }
        .status-live { background: rgba(234, 32, 39, 0.1); color: #EA2027; }
        .status-offline { background: #f1f2f6; color: #a4b0be; }

        /* CUSTOM SCROLLBAR */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(102, 126, 234, 0.5); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(102, 126, 234, 0.8); }

        /* UTILS */
        .hidden { display: none !important; }
        
        /* Selected Idol Sticky Header in Grid */
        .selected-idol-banner {
            background: linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%);
            border-radius: 12px;
            padding: 15px 20px;
            margin-bottom: 20px;
            color: #155724;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 10px 20px rgba(120, 255, 214, 0.3);
            display: none;
            animation: slideDown 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive text */
        .text-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 800;
        }

        /* --- MOBILE BOTTOM NAV (TAB BAR) --- */
        .mobile-bottom-nav {
            display: none; /* Ẩn trên Desktop */
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 70px;
            background: rgba(30, 30, 40, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255,255,255,0.1);
            justify-content: space-around;
            align-items: center;
            z-index: 9999;
            padding-bottom: env(safe-area-inset-bottom);
            box-shadow: 0 -5px 20px rgba(0,0,0,0.2);
        }

        .nav-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #b2bec3;
            text-decoration: none;
            font-size: 0.75rem;
            font-weight: 600;
            transition: all 0.3s ease;
            cursor: pointer;
            height: 100%;
        }

        .nav-item svg {
            width: 24px;
            height: 24px;
            margin-bottom: 4px;
            fill: currentColor;
        }

        .nav-item.active {
            color: #764ba2;
        }

        .nav-item.active svg {
            fill: #764ba2;
            transform: translateY(-2px);
        }

        /* --- MOBILE RESPONSIVE QUERIES --- */
        @media (max-width: 992px) {
            body {
                padding: 15px; /* Giảm padding trên mobile */
                padding-bottom: 90px; /* Chừa chỗ cho Bottom Nav */
            }

            .main-container {
                display: flex !important;
                flex-direction: column; /* Chuyển thành cột dọc */
                gap: 20px !important;
                min-width: 0 !important; /* Reset width cứng */
            }

            .sidebar-container {
                width: 100%;
                position: relative; /* Bỏ sticky trên mobile để tiết kiệm diện tích */
                top: 0;
                display: none; /* Mặc định ẩn, sẽ được JS bật lại nếu là tab active */
            }

            .idol-container {
                width: 100%;
                height: auto;
                display: none; /* Mặc định ẩn, sẽ được JS bật lại nếu là tab active */
            }
            
            /* GIẢM PADDING CHO GLASS PANEL TRÊN MOBILE ĐỂ CÓ NHIỀU CHỖ HƠN */
            .glass-panel {
                padding: 15px !important;
            }
            
            /* Class hỗ trợ Tab Switch trên Mobile */
            .mobile-tab-active {
                display: block !important;
                animation: fadeInTab 0.3s ease;
            }

            @keyframes fadeInTab {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .idol-grid {
                /* Hiển thị 2 cột trên điện thoại cho đẹp */
                /* Thêm justify-content center để fix lỗi lệch */
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
                max-height: none; /* Mobile scroll toàn trang */
                overflow: visible; /* Để scroll body */
                gap: 15px; /* Tăng khoảng cách chút */
                justify-content: center; /* Căn giữa lưới */
                padding: 5px; /* Giảm padding */
                /* Đảm bảo nội dung không bị che */
                padding-bottom: 80px; 
            }

            .idol-card {
                padding: 15px;
            }
            
            .idol-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .search-wrapper {
                width: 100%;
            }

            .login-container {
                margin: 5vh auto !important;
                width: 100% !important;
                padding: 20px !important;
            }
            
            /* Hiển thị Bottom Nav trên Mobile */
            .mobile-bottom-nav {
                display: flex;
            }
            
            /* Giảm kích thước chữ trên mobile */
            .idol-header h2 { font-size: 1.3rem; }
            .login-header h1 { font-size: 1.5rem; }
        }

        /* Cho màn hình cực nhỏ (iPhone SE, Android nhỏ) */
        @media (max-width: 480px) {
            .idol-grid {
                grid-template-columns: 1fr 1fr; /* Bắt buộc 2 cột */
                gap: 10px;
            }
            
            /* Giảm thêm padding card */
            .idol-card {
                padding: 10px;
            }
            
            .idol-avatar-img {
                width: 60px;
                height: 60px;
            }
        }

    </style>
</head>

<body>
    <div class="main-container">
        <!-- LOGIN PANEL (Đã thêm ID và style="display: none" để ẩn mặc định) -->
        <div class="login-container glass-panel" id="loginContainer" style="display: none;">
            <div class="login-header" style="text-align: center; margin-bottom: 30px;">
                <h1>MMLive Tools</h1>
                <p style="color: #666; font-size: 0.95rem;">Chào mừng bạn trở lại! Vui lòng đăng nhập vào tài khoản của bạn.</p> <!-- Changed Text -->
            </div>

            <form id="loginForm" novalidate>
                <div class="form-group">
                    <label for="email">SỐ ĐIỆN THOẠI</label>
                    <input type="tel" id="email" name="email" placeholder="09xx xxx xxx" required> <!-- Changed Placeholder -->
                    <div class="error-message" id="emailError" style="color:red; font-size:0.8rem; margin-top:5px; display:none">SĐT không hợp lệ</div>
                </div>

                <div class="form-group">
                    <label for="password">MẬT KHẨU</label>
                    <div style="position: relative;">
                        <input type="password" id="password" name="password" placeholder="Nhập mật khẩu..." required>
                        <span class="password-toggle" onclick="togglePassword()" style="position:absolute; right:15px; top:12px; cursor:pointer; opacity:0.5;">👁️</span>
                    </div>
                    <div class="error-message" id="passwordError" style="color:red; font-size:0.8rem; margin-top:5px; display:none">Mật khẩu quá ngắn</div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 25px; font-size: 0.9rem;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="remember"> Ghi Nhớ Đăng Nhập
                    </label>
                    <a href="#" style="color: var(--accent-color); text-decoration: none; font-weight: 600;">Quên mật khẩu?</a>
                </div>

                <button type="submit" class="login-btn">Đăng Nhập</button> <!-- Changed Text -->
            </form>
        </div>

        <!-- LEFT COLUMN: USER INFO & TOOLS (Balanced Height) -->
        <!-- Đã thêm ID tab-account để điều khiển Mobile Tab -->
        <div class="sidebar-container glass-panel" id="sidebarSection">
            <!-- User Profile Header -->
            <div id="userInfoSection">
                <div class="profile-card-header">
                    <div style="position: relative; display: inline-block;">
                        <img id="userAvatar" src="" onerror="this.src='https://ui-avatars.com/api/?name=User&background=random'" alt="Avatar" class="avatar-glow">
                        <div style="position: absolute; bottom: 15px; right: 0; width: 20px; height: 20px; background: #2ed573; border: 3px solid white; border-radius: 50%;"></div>
                    </div>
                    <h3 id="userNickname" style="font-size: 1.4rem; margin: 10px 0 5px; font-weight: 800;">Loading...</h3>
                    <p id="userSignature" style="color: #666; font-size: 0.9rem; font-style: italic;">Đang tải thông tin...</p>
                    
                    <div style="margin-top: 15px; display: flex; justify-content: center; gap: 10px;">
                        <span class="stat-badge" style="background: linear-gradient(45deg, #ff6b6b, #ee5253);">
                            ❤ <span id="userFans" style="margin-left: 5px">0</span>
                        </span>
                        <span class="stat-badge" style="background: linear-gradient(45deg, #5f27cd, #341f97);">
                            ★ <span id="userFollows" style="margin-left: 5px">0</span>
                        </span>
                    </div>
                </div>

                <!-- Technical Info Details (UPDATED V12: Added UDID & Login Time) -->
                <div style="background: rgba(255, 248, 225, 0.9); border: 2px solid #ffcc80; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
                    <h4 style="font-size: 0.8rem; color: #ff9800; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px; font-weight: 800;">THÔNG TIN TÀI KHOẢN</h4>
                    <div class="info-row" style="border-bottom: 1px solid rgba(255, 152, 0, 0.2);">
                        <span class="info-label" style="color: #5d4037;">User ID</span>
                        <span class="info-value" id="displayUserId" style="color: #5758BB">---</span>
                    </div>
                    <div class="info-row" style="border-bottom: 1px solid rgba(255, 152, 0, 0.2);">
                        <span class="info-label" style="color: #5d4037;">Cấp độ</span>
                        <span class="info-value" id="userLevel" style="color: #0984e3">Lv.0</span>
                    </div>
                    <div class="info-row" style="border-bottom: 1px solid rgba(255, 152, 0, 0.2);">
                        <span class="info-label" style="color: #5d4037;">Xu vàng</span>
                        <span class="info-value" id="userGoldCoin" style="color: #f1c40f">0</span>
                    </div>
                    <div class="info-row" style="border-bottom: 1px solid rgba(255, 152, 0, 0.2);">
                        <span class="info-label" style="color: #5d4037;">Thành phố</span>
                        <span class="info-value" id="userCity" style="color: #333;">---</span>
                    </div>
                    <div class="info-row" style="border-bottom: 1px solid rgba(255, 152, 0, 0.2);">
                        <span class="info-label" style="color: #5d4037;">Anchor ID</span>
                        <span class="info-value" id="displayAnchorId" style="color: #00b894">---</span>
                    </div>
                    <!-- Added UDID Row -->
                    <div class="info-row" style="border-bottom: 1px solid rgba(255, 152, 0, 0.2);">
                        <span class="info-label" style="color: #5d4037;">UDID</span>
                        <span class="info-value" id="displayUdid" style="color: #6c757d; font-size: 0.8rem;" title="">---</span>
                    </div>
                    <!-- Added Login Time Row -->
                    <div class="info-row" style="border-bottom: none;">
                        <span class="info-label" style="color: #5d4037;">Đăng nhập</span>
                        <span class="info-value" id="displayLoginTime" style="color: #333; font-size: 0.85rem;">---</span>
                    </div>
                </div>

                <!-- Tools Section (V14 COMPACT GRID) -->
                <div style="border-top: 1px solid rgba(0,0,0,0.1); padding-top: 20px;">
                    <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                        ⚡ TÁC VỤ NHANH
                    </h4>
                    
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label>Số lượng View/Tương tác</label>
                        
                        <!-- ĐÃ SỬA: Gom Input và Nút Clear vào Wrapper -->
                        <div style="position: relative;">
                            <!-- Input (padding-right 60px để tránh đè chữ lên nút X và nút tăng giảm) -->
                            <input type="number" id="customRequests" value="0" min="0" max="10000" style="text-align: center; font-weight: bold; color: var(--accent-color); padding-right: 60px;">
                            
                            <!-- Nút X (Xóa) Mới - Nằm GỌN TRONG INPUT, bên phải, DỜI SANG TRÁI 30px -->
                            <button type="button" onclick="resetCustomRequests()" class="clear-input-btn">✕</button>
                        </div>
                        
                        <!-- NEW: Neon Controller Buttons (White Text + Dark Translucent + Compact Grid) -->
                        <div class="quick-select-group">
                            <button type="button" onclick="addToCustomView(100)" class="quick-btn btn-cyan">+ 100</button>
                            <button type="button" onclick="addToCustomView(200)" class="quick-btn btn-green">+ 200</button>
                            <button type="button" onclick="addToCustomView(300)" class="quick-btn btn-purple">+ 300</button>
                            <button type="button" onclick="addToCustomView(1000)" class="quick-btn btn-orange">+ 1k</button> <!-- Changed 1000 to 1k -->
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <!-- Updated Main Buttons with White Text -->
                        <button onclick="runTurboModeWithInput()" class="tool-btn glow-green" style="padding: 12px;">
                            🚀 BUFF VIEW
                        </button>
                        <button onclick="runPhaIdolMode()" class="tool-btn glow-red" style="padding: 12px;">
                            💥 PHÁ IDOL
                        </button>
                    </div>

                    <button onclick="logout(); location.reload();" class="tool-btn glow-white" style="width: 100%; margin-top: 20px; padding: 12px;">
                        🚪 ĐĂNG XUẤT
                    </button>
                </div>
            </div>
        </div>

        <!-- RIGHT COLUMN: IDOL SELECTION & RESULTS (Balanced Height) -->
        <!-- Đã thêm ID idolSection để điều khiển Mobile Tab -->
        <div class="idol-container glass-panel" id="idolSection" style="display: none;">
            
            <!-- Result Console (Hidden by default) -->
            <div id="runResultsPanel" style="display: none; background: #2d3436; color: #dfe6e9; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #636e72; padding-bottom: 10px;">
                    <h4 style="margin: 0; color: #81ecec;">📊 TERMINAL STATUS</h4>
                    <span id="progressCount" style="font-family: monospace; font-weight: bold;">0/0</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 5px; color: #b2bec3;">
                        <span id="progressText">Ready...</span>
                    </div>
                    <div style="width: 100%; background: #636e72; height: 6px; border-radius: 3px; overflow: hidden;">
                        <div id="progressBar" style="width: 0%; background: #00b894; height: 100%; transition: width 0.2s;"></div>
                    </div>
                </div>

                <div id="runResults" style="height: 150px; overflow-y: auto; font-family: 'Consolas', monospace; font-size: 0.8rem; line-height: 1.4; color: #a4b0be;">
                    <!-- Logs go here -->
                </div>

                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button onclick="stopRunning()" id="stopBtn" class="tool-btn" style="background: #e17055; padding: 8px 15px; font-size: 0.8rem; width: auto; color: white; border: none;">⏹ STOP</button>
                    <button onclick="clearResults()" class="tool-btn" style="background: #636e72; padding: 8px 15px; font-size: 0.8rem; width: auto; color: white; border: none;">🗑 CLEAR</button>
                </div>
            </div>

            <!-- Selected Idol Active Banner -->
            <div id="selectedIdolInfo" class="selected-idol-banner">
                <div id="selectedIdolDetails" style="flex-grow: 1; display: flex; align-items: center; justify-content: space-between;">
                    <!-- JS fills this -->
                </div>
            </div>

            <!-- Header & Search -->
            <div class="idol-header">
                <div>
                    <h2>DANH SÁCH IDOL</h2>
                    <p style="color: #888; font-size: 0.9rem;" id="searchResultsCount">Đang tải dữ liệu...</p>
                </div>
                <div class="search-wrapper">
                    <input type="text" id="idolSearchInput" placeholder="Tìm tên hoặc ID..." class="search-input">
                    <button onclick="searchIdols()" class="search-btn" style="padding: 8px 15px; border-radius: 8px;">🔍</button>
                    <button onclick="clearSearch()" class="search-btn" style="padding: 8px 15px; border-radius: 8px; margin-left: 5px; background: #b2bec3;">✕</button>
                </div>
            </div>

            <!-- Idol Grid -->
            <div class="idol-grid" id="idolGrid">
                <!-- Cards injected via JS -->
            </div>
        </div>
    </div>
    
    <!-- MOBILE BOTTOM NAVIGATION (NEW FEATURE) -->
    <div class="mobile-bottom-nav" id="mobileBottomNav">
        <div class="nav-item active" onclick="switchMobileTab('idol')" id="tabBtnIdol">
            <!-- Icon Ngôi Nhà -->
            <svg viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span>Trang chủ</span>
        </div>
        <div class="nav-item" onclick="switchMobileTab('account')" id="tabBtnAccount">
            <!-- Icon Cài đặt (Gear/Setting) - ĐÃ ĐỔI THEO YÊU CẦU -->
            <svg viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
            <span>Cài đặt</span>
        </div>
    </div>

    <!-- JAVASCRIPT LOGIC GIỮ NGUYÊN 100% -->
    <script>
        // =================================================================
        // 1. CẤU HÌNH ĐƯỜNG DẪN FILE CONFIG (QUAN TRỌNG NHẤT)
        // =================================================================
        // Bạn phải đảm bảo đường link này đúng với nơi bạn up file config
        const CONFIG_URL = "https://tieuli158.github.io/Tieuli/mmlive_config.json";

        // =================================================================
        // 2. HÀM KIỂM TRA TRẠNG THÁI TỪ XA (REMOTE KILL SWITCH)
        // =================================================================

        // --- NEW FUNCTION: MOBILE TAB SWITCHING ---
        function switchMobileTab(tabName) {
            // Chỉ hoạt động nếu đang ở chế độ mobile (width <= 992px)
            if (window.innerWidth > 992) return;

            const idolSection = document.getElementById('idolSection');
            const sidebarSection = document.getElementById('sidebarSection');
            const tabBtnIdol = document.getElementById('tabBtnIdol');
            const tabBtnAccount = document.getElementById('tabBtnAccount');

            if (tabName === 'idol') {
                // Show Idol - DÙNG FLEX ĐỂ GIỮ CẤU TRÚC
                idolSection.style.display = 'flex'; 
                idolSection.classList.add('mobile-tab-active');
                
                // Hide Sidebar (Quan trọng: Phải set display none vì inline style đang là block)
                sidebarSection.style.display = 'none';
                sidebarSection.classList.remove('mobile-tab-active');
                
                // Active Button State
                tabBtnIdol.classList.add('active');
                tabBtnAccount.classList.remove('active');
            } else {
                // Show Sidebar
                sidebarSection.style.display = 'block';
                sidebarSection.classList.add('mobile-tab-active');
                
                // Hide Idol (Quan trọng: Phải set display none)
                idolSection.style.display = 'none';
                idolSection.classList.remove('mobile-tab-active');
                
                // Active Button State
                tabBtnAccount.classList.add('active');
                tabBtnIdol.classList.remove('active');
            }
        }
        
        // Listen for resize to reset styles if user switches to desktop
        window.addEventListener('resize', function() {
             const idolSection = document.getElementById('idolSection');
             const sidebarSection = document.getElementById('sidebarSection');
             
             if (window.innerWidth > 992 && isLoggedIn()) {
                 // Reset classes on desktop to ensure both columns show
                 idolSection.classList.remove('mobile-tab-active');
                 sidebarSection.classList.remove('mobile-tab-active');
                 
                 // Force display block for desktop layout
                 idolSection.style.display = 'flex';
                 sidebarSection.style.display = 'block';
             } else if (window.innerWidth <= 992 && isLoggedIn()) {
                 // Re-apply current tab logic if switching back to mobile
                 // Default to Idol tab if none active
                 const tabBtnIdol = document.getElementById('tabBtnIdol');
                 const tabBtnAccount = document.getElementById('tabBtnAccount');
                 
                 if (!tabBtnIdol.classList.contains('active') && !tabBtnAccount.classList.contains('active')) {
                     switchMobileTab('idol');
                 } else if (tabBtnIdol.classList.contains('active')) {
                     switchMobileTab('idol');
                 } else {
                     switchMobileTab('account');
                 }
             }
        });

        // NEW FUNCTION: RESET SỐ LƯỢNG VỀ 0
        function resetCustomRequests() {
            const input = document.getElementById('customRequests');
            if(input) {
                input.value = 0;
                // Hiệu ứng Visual Feedback
                input.style.transition = 'all 0.1s';
                input.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    input.style.transform = 'scale(1)';
                }, 100);
            }
        }

        // NEW FUNCTION: CỘNG DỒN SỐ LƯỢNG VIEW (ADDITIVE)
        function addToCustomView(amount) {
            const input = document.getElementById('customRequests');
            if(input) {
                // Lấy giá trị hiện tại, nếu rỗng hoặc NaN thì coi là 0
                let currentVal = parseInt(input.value) || 0;
                
                // Cộng thêm lượng mới
                let newVal = currentVal + amount;
                
                // Giới hạn max 10000 (hoặc có thể bỏ nếu muốn)
                if (newVal > 10000) newVal = 10000; 
                
                input.value = newVal;

                // Hiệu ứng Visual Feedback khi bấm
                input.style.transition = 'all 0.1s';
                input.style.transform = 'scale(1.1)';
                input.style.color = '#fff'; // Flash white text
                
                setTimeout(() => {
                    input.style.transform = 'scale(1)';
                    input.style.color = 'var(--accent-color)'; // Revert color
                }, 150);
            }
        }

        // LIST_IDOL đã được xóa - chỉ sử dụng API data

        // ===== GLOBAL CONFIGURATION VARIABLES =====
        const GLOBAL_CONFIG = {
            liveId: 1027295,        // Live stream ID (sẽ được cập nhật khi chọn idol)
            anchorId: 2026922943    // Anchor/Streamer ID (sẽ được cập nhật khi chọn idol)
        };

        let selectedIdol = null;

        // ===== IDOL SELECTION FUNCTIONS =====

        // Render danh sách idol từ API
        function renderIdolList() {
            const idolGrid = document.getElementById('idolGrid');
            if (!idolGrid) return;

            // Nếu có data từ API, sử dụng renderApiIdolList
            if (apiIdolsData && apiIdolsData.length > 0) {
                console.log('📋 Rendering API idol list');
                renderApiIdolList(apiIdolsData);
                return;
            }

            // Nếu chưa có data từ API, hiển thị placeholder
            console.log('⏳ Waiting for API idol data...');
            idolGrid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1 / -1; padding: 40px;">Đang tải danh sách idol...<br><small>Vui lòng đăng nhập để xem danh sách idol</small></p>';
        }

        // Chọn idol
        function selectIdol(idol) {
            console.log('🎯 selectIdol called with:', idol);
            selectedIdol = idol;

            // Cập nhật GLOBAL_CONFIG
            GLOBAL_CONFIG.liveId = idol.liveId;
            GLOBAL_CONFIG.anchorId = idol.anchorId;

            console.log('🎯 Updated selectedIdol:', selectedIdol);
            console.log('🎯 Updated GLOBAL_CONFIG:', GLOBAL_CONFIG);

            // Cập nhật UI
            updateSelectedIdolInfo(idol);
            updateIdolCardSelection();
            updateToolSectionDisplay(idol);

            console.log(`✅ Đã chọn idol: ${idol.nickname} (Live ID: ${idol.liveId}, Anchor ID: ${idol.anchorId})`);
        }

        // Cập nhật hiển thị trong tool section
        function updateToolSectionDisplay(idol) {
            // Cập nhật Anchor ID display
            const anchorIdElement = document.getElementById('displayAnchorId');
            if (anchorIdElement) {
                anchorIdElement.textContent = idol.anchorId;
                anchorIdElement.style.color = '#28a745';
                anchorIdElement.title = `Anchor ID từ ${idol.nickname}`;
            }

            // Nếu có thêm thông tin live ID cần hiển thị, có thể thêm ở đây
            console.log(`🔄 Đã cập nhật Tool Section với thông tin từ ${idol.nickname}`);
        }

        // Cập nhật thông tin idol được chọn
        function updateSelectedIdolInfo(idol) {
            const selectedInfo = document.getElementById('selectedIdolInfo');
            const selectedDetails = document.getElementById('selectedIdolDetails');

            if (selectedInfo && selectedDetails) {
                selectedDetails.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <img src="${idol.avatar}" alt="${idol.nickname}" 
                             style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
                             onerror="this.style.display='none'">
                        <div>
                            <div style="font-weight: 800; font-size: 1.1rem;">${idol.nickname || 'Unknown'}</div>
                            <div style="font-size: 0.85rem; opacity: 0.8;">Live ID: ${idol.liveId}</div>
                        </div>
                    </div>
                    <div style="font-weight: 700; font-family: monospace; background: rgba(255,255,255,0.3); padding: 5px 10px; border-radius: 8px;">
                        ANCHOR: ${idol.anchorId || 'N/A'}
                    </div>
                `;
                selectedInfo.style.display = 'flex';
            }
        }

        // Cập nhật trạng thái selected của các idol card
        function updateIdolCardSelection() {
            console.log('🔄 updateIdolCardSelection called, selectedIdol:', selectedIdol);
            const idolCards = document.querySelectorAll('.idol-card');

            // Xóa tất cả selection trước
            idolCards.forEach(card => card.classList.remove('selected'));

            // Thêm selection cho card đúng
            if (selectedIdol) {
                console.log('🔍 selectedIdol.id type:', typeof selectedIdol.id, 'value:', selectedIdol.id);
                idolCards.forEach((card, index) => {
                    const cardIdolId = card.getAttribute('data-idol-id');
                    console.log(`🔍 Card ${index} data-idol-id type:`, typeof cardIdolId, 'value:', cardIdolId);

                    // So sánh cả == và === để test
                    const matchLoose = cardIdolId == selectedIdol.id;
                    const matchStrict = cardIdolId === String(selectedIdol.id);
                    const isSelected = matchLoose || matchStrict;

                    console.log(`🔄 Card ${index}: cardId=${cardIdolId}, selectedId=${selectedIdol.id}, loose=${matchLoose}, strict=${matchStrict}, final=${isSelected}`);

                    if (isSelected) {
                        card.classList.add('selected');
                        console.log(`✅ Added 'selected' class to card ${index}`);
                    }
                });
            }
        }

        // Hàm tạo GUID
        function getGuid() {
            const timestamp = new Date().getTime();
            const random = Math.floor(Math.random() * 10000000000000000);
            const deviceInfo = "YourDeviceInfoHere";
            const combinedData = `${timestamp}${random}${deviceInfo}`;
            const deviceID = md5(combinedData).substr(0, 32);
            return deviceID;
        }

        // Hàm đăng nhập API
        async function loginAPI(mobile, password) {
            console.log('=== LoginAPI Started ===');

            const timestamp = new Date().getTime();
            const uid = getGuid(); // Sử dụng GUID làm uid

            console.log('Generated UID:', uid);
            console.log('Timestamp:', timestamp);

            // Tạo sign theo format của API
            const sign = md5(`${uid}jgyh,kasd${timestamp}`);
            const xSign = md5(`${uid}jgyh,kasd${timestamp}`); // Sử dụng cùng format với sign

            console.log('Generated signs:', { sign, xSign });

            const loginParams = {
                os: 0,
                sign: sign,
                timestamp: timestamp,
                udid: uid,
                model: "PC",
                mobile: mobile,
                password: password,
                version: "1.0.2",
                softVersion: "1.0.0"
            };

            console.log('Login Parameters:', loginParams);

            try {
                const response = await fetch('https://gateway.mmlive.online/center-client/sys/auth/new/phone/login', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json, text/plain, */*',
                        'accept-language': 'VI',
                        'appid': 'MMLive',
                        'content-type': 'application/json;charset=UTF-8',
                        'n-l': 'Y',
                        'origin': 'https://mmlive.online',
                        'os': '0',
                        'p-g': 'N',
                        'referer': 'https://mmlive.online/',
                        'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"macOS"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-site',
                        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                        'x-appversion': '2.5.0',
                        'x-language': 'VI',
                        'x-sign': xSign,
                        'x-timestamp': timestamp.toString(),
                        'x-udid': uid
                    },
                    body: JSON.stringify(loginParams)
                });

                let result;
                try {
                    result = await response.json();
                } catch (parseError) {
                    console.error('JSON Parse Error:', parseError);
                    return { success: false, error: 'Server trả về dữ liệu không hợp lệ' };
                }

                console.log('API Response:', result);

                // Kiểm tra cấu trúc response
                if (!result || typeof result !== 'object') {
                    return { success: false, error: 'Response không hợp lệ' };
                }

                console.log('Response status:', response.status, response.ok);
                console.log('Result code:', result.code);

                if (response.ok && result.code === 0) {
                    console.log('✅ Login successful:', result);

                    // Kiểm tra data có tồn tại không
                    if (!result.data || !result.data.token) {
                        console.log('❌ No token in response');
                        return { success: false, error: 'Không nhận được token từ server' };
                    }

                    console.log('💾 Saving login data to localStorage');
                    // Lưu thông tin đăng nhập vào localStorage
                    localStorage.setItem('authToken', result.data.token);
                    localStorage.setItem('randomKey', result.data.randomKey || '');
                    localStorage.setItem('randomVector', result.data.randomVector || '');
                    localStorage.setItem('loginTime', new Date().toISOString());
                    localStorage.setItem('udid', uid); // Lưu udid để sử dụng sau

                    const successResult = { success: true, data: result.data, message: result.msg || 'Đăng nhập thành công' };
                    console.log('🚀 Returning success result:', successResult);
                    return successResult;
                } else {
                    console.error('❌ Login failed:', result);
                    const errorMsg = result.msg || result.message || `HTTP ${response.status}: ${response.statusText}`;
                    const errorResult = { success: false, error: errorMsg };
                    console.log('💥 Returning error result:', errorResult);
                    return errorResult;
                }
            } catch (error) {
                console.error('🚨 Network/Parse error:', error);
                console.error('Error name:', error.name);
                console.error('Error message:', error.message);

                // Xử lý các loại lỗi khác nhau
                let errorMessage = 'Lỗi kết nối mạng';
                if (error.name === 'TypeError') {
                    errorMessage = 'Lỗi kết nối - Kiểm tra internet';
                } else if (error.name === 'SyntaxError') {
                    errorMessage = 'Server trả về dữ liệu không hợp lệ';
                } else if (error.message) {
                    errorMessage = error.message;
                }

                const catchResult = { success: false, error: errorMessage };
                console.log('🔄 Returning catch result:', catchResult);
                return catchResult;
            }

            // Fallback return (không bao giờ nên đến đây)
            console.log('⚠️ Reached fallback return - this should not happen');
            return { success: false, error: 'Lỗi không xác định' };
        }

        // Hàm kiểm tra trạng thái đăng nhập
        function isLoggedIn() {
            const token = localStorage.getItem('authToken');
            return token && token.length > 0;
        }

        // Hàm lấy thông tin đăng nhập đã lưu
        function getLoginInfo() {
            return {
                token: localStorage.getItem('authToken'),
                randomKey: localStorage.getItem('randomKey'),
                randomVector: localStorage.getItem('randomVector'),
                loginTime: localStorage.getItem('loginTime')
            };
        }

        // Hàm đăng xuất (xóa thông tin đã lưu)
        function logout() {
            localStorage.removeItem('authToken');
            localStorage.removeItem('randomKey');
            localStorage.removeItem('randomVector');
            localStorage.removeItem('loginTime');
            localStorage.removeItem('udid');
            // Remove remembered credentials on explicit logout if desired, 
            // but usually "Remember Me" persists until unchecked.
            // Uncomment below lines if logout should clear remembered data:
            // localStorage.removeItem('savedMobile');
            // localStorage.removeItem('savedPassword');
            // localStorage.removeItem('isRemembered');
            
            console.log('Đã đăng xuất và xóa tất cả thông tin đăng nhập');
        }

        // Hàm decode JWT token để lấy thông tin
        function getTokenData() {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.log('No token found');
                return { userId: null, udid: null };
            }

            try {
                // JWT token có 3 phần được phân tách bởi dấu chấm: header.payload.signature
                const parts = token.split('.');
                if (parts.length !== 3) {
                    console.log('Invalid JWT token format - expecting 3 parts, got:', parts.length);
                    return { userId: null, udid: null };
                }

                // Decode phần payload (phần thứ 2) - JWT sử dụng base64url encoding
                let payload = parts[1];

                // Chuyển base64url thành base64 thông thường
                payload = payload.replace(/-/g, '+').replace(/_/g, '/');

                // Thêm padding nếu cần thiết cho base64 decode
                while (payload.length % 4) {
                    payload += '=';
                }

                console.log('JWT payload part:', parts[1]);
                console.log('Base64 payload after conversion:', payload);

                const decodedPayload = atob(payload);
                console.log('Decoded payload string:', decodedPayload);

                const userData = JSON.parse(decodedPayload);
                console.log('Parsed JWT payload:', userData);

                // Thử các field phổ biến cho userId
                const userId = userData.userId || userData.id || userData.sub || userData.user_id || userData.uid;

                // Thử các field phổ biến cho udid
                const udid = userData.udid || userData.deviceId || userData.device_id || userData.uuid;

                console.log('Extracted userId:', userId);
                console.log('Extracted udid:', udid);

                return { userId, udid };
            } catch (error) {
                console.error('Error decoding JWT token:', error);
                console.error('Token parts:', token.split('.').length);

                // Log thêm thông tin debug
                if (token.split('.').length === 3) {
                    console.error('Payload part:', token.split('.')[1]);
                }

                return { userId: null, udid: null };
            }
        }

        // Hàm decode JWT token để lấy userId (backward compatibility)
        function getUserIdFromToken() {
            return getTokenData().userId;
        }

        // Hàm decode JWT token để lấy udid
        function getUdidFromToken() {
            return getTokenData().udid;
        }

        // Hàm gọi API để lấy thông tin user chi tiết
        async function getUserInfo() {
            const loginInfo = getLoginInfo();
            if (!loginInfo.token) {
                console.error('No token found for getUserInfo');
                return null;
            }

            const tokenData = getTokenData();
            const udid = tokenData.udid || localStorage.getItem('udid') || getGuid();
            const timestamp = new Date().getTime();
            const xSign = md5(`${udid}jgyh,kasd${timestamp}`)

            try {
                console.log('🔍 Fetching user info...');
                const response = await fetch('https://gateway.mmlive.online/center-client/sys/user/get/info', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json, text/plain, */*',
                        'accept-language': 'VI',
                        'appid': 'MMLive',
                        'authorization': `HSBox ${loginInfo.token}`,
                        'content-type': 'application/json;charset=UTF-8',
                        'n-l': 'Y',
                        'origin': 'https://mmlive.online',
                        'os': '0',
                        'p-g': 'N',
                        'referer': 'https://mmlive.online/',
                        'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"macOS"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-site',
                        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                        'x-appversion': '2.5.0',
                        'x-language': 'VI',
                        'x-sign': xSign,
                        'x-timestamp': timestamp.toString(),
                        'x-udid': udid
                    },
                    body: JSON.stringify({ "os": 0 })
                });

                const result = await response.json();
                console.log('👤 User info response:', result);

                if (result.code === 0 && result.data) {
                    return result.data;
                } else {
                    console.error('Failed to get user info:', result.msg);
                    return null;
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                return null;
            }
        }

        // Hàm cập nhật thông tin user lên UI
        function updateUserInfoDisplay(userDetail = null) {
            const tokenData = getTokenData();
            const userId = tokenData.userId;
            const udid = tokenData.udid;
            const loginTime = localStorage.getItem('loginTime');

            // Hiển thị User ID
            const userIdElement = document.getElementById('displayUserId');
            if (userId) {
                userIdElement.textContent = userId;
                userIdElement.style.color = '#667eea';
            } else {
                userIdElement.textContent = 'Không tìm thấy';
                userIdElement.style.color = '#dc3545';
            }

            // Hiển thị UDID
            const udidElement = document.getElementById('displayUdid');
            if (udid) {
                // Hiển thị 16 ký tự đầu và thêm tooltip
                udidElement.textContent = udid.substring(0, 16) + '...'; 
                udidElement.title = udid; // Full UDID on hover
                udidElement.style.color = '#17a2b8';
            } else {
                const fallbackUdid = localStorage.getItem('udid') || getGuid();
                udidElement.textContent = fallbackUdid.substring(0, 16) + '... (local)';
                udidElement.title = fallbackUdid;
                udidElement.style.color = '#ffc107';
            }

            // Hiển thị Anchor ID (giống User ID)
            const anchorIdElement = document.getElementById('displayAnchorId');
            if (userId) {
                anchorIdElement.textContent = userId;
                anchorIdElement.style.color = '#28a745';
            } else {
                const fallbackAnchorId = Math.floor(Math.random() * 999999999) + 2000000000;
                anchorIdElement.textContent = `${fallbackAnchorId} (random)`;
                anchorIdElement.style.color = '#ffc107';
            }

            // Hiển thị Login Time
            const loginTimeElement = document.getElementById('displayLoginTime');
            if (loginTime) {
                // Format: 12h (SA/CH) - Ngày/Tháng/Năm
                const d = new Date(loginTime);
                const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: true }); // e.g. 11:22 CH
                const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); // e.g. 03/02/2026
                loginTimeElement.textContent = `${timeStr} - ${dateStr}`;
            } else {
                loginTimeElement.textContent = 'Không xác định';
            }

            // Hiển thị thông tin chi tiết user nếu có
            if (userDetail) {
                updateUserProfileDisplay(userDetail);
            }

            console.log('✅ Updated user info display - UserID:', userId, 'UDID:', udid);
        }

        // Hàm cập nhật thông tin profile user
        function updateUserProfileDisplay(userDetail) {
            const profileSection = document.getElementById('userInfoSection');

            if (userDetail) {
                // Hiển thị avatar
                const avatarElement = document.getElementById('userAvatar');
                if (userDetail.avatar && userDetail.avatar.trim() !== '') {
                    avatarElement.src = userDetail.avatar;
                    // Thêm error handling cho avatar - nếu lỗi thì hiển thị avatar mặc định
                    avatarElement.onerror = function () {
                        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNGRkY5ODAiLz4KPGV2Y2lyY2xlIGN4PSIzMCIgY3k9IjI1IiByeD0iOCIgcnk9IjgiIGZpbGw9IiNGRkM2MDciLz4KPGV2cGF0aCBkPSJNMTAgNDVDMTAgMzYuNzE1NyAxNi43MTU3IDMwIDI1IDMwSDM1QzQzLjI4NDMgMzAgNTAgMzYuNzE1NyA1MCA0NVY1MEgxMFY0NVoiIGZpbGw9IiNGRkM2MDciLz4KPC9zdmc+';
                        console.log('⚠️ Could not load avatar image, using default');
                    };
                } else {
                    // Hiển thị avatar mặc định khi không có avatar
                    avatarElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNGRkY5ODAiLz4KPGV2Y2lyY2xlIGN4PSIzMCIgY3k9IjI1IiByeD0iOCIgcnk9IjgiIGZpbGw9IiNGRkM2MDciLz4KPGV2cGF0aCBkPSJNMTAgNDVDMTAgMzYuNzE1NyAxNi43MTU3IDMwIDI1IDMwSDM1QzQzLjI4NDMgMzAgNTAgMzYuNzE1NyA1MCA0NVY1MEgxMFY0NVoiIGZpbGw9IiNGRkM2MDciLz4KPC9zdmc+';
                    console.log('ℹ️ No avatar provided, using default avatar');
                }

                // Hiển thị nickname với decode emoji
                const nicknameElement = document.getElementById('userNickname');
                let nickname = userDetail.nickname || 'Không có tên';
                // Decode Unicode escape sequences như \uD83D\uDE0B
                try {
                    nickname = JSON.parse('"' + nickname.replace(/\\/g, '\\') + '"');
                } catch (e) {
                    // Nếu không decode được thì giữ nguyên
                }
                nicknameElement.textContent = nickname;

                // Hiển thị fans với định dạng số
                const fansElement = document.getElementById('userFans');
                const fansCount = userDetail.fans || 0;
                fansElement.textContent = fansCount.toLocaleString('vi-VN');

                // Hiển thị follows với định dạng số
                const followsElement = document.getElementById('userFollows');
                const followsCount = userDetail.follows || 0;
                followsElement.textContent = followsCount.toLocaleString('vi-VN');

                // Hiển thị chữ ký
                const signatureElement = document.getElementById('userSignature');
                signatureElement.textContent = userDetail.signature || 'Chưa có chữ ký';

                // Hiển thị thành phố
                const cityElement = document.getElementById('userCity');
                cityElement.textContent = userDetail.city || 'Chưa cập nhật';

                // Hiển thị level
                const levelElement = document.getElementById('userLevel');
                levelElement.textContent = `Lv.${userDetail.userLevel || 0}`;

                // Hiển thị xu vàng với định dạng
                const goldCoinElement = document.getElementById('userGoldCoin');
                const goldCoin = parseFloat(userDetail.goldCoin) || 0;
                goldCoinElement.textContent = goldCoin.toLocaleString('vi-VN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                console.log('✅ Updated user profile display:', nickname, 'Fans:', fansCount, 'Follows:', followsCount);
            } 
        }

        // ===== DANH SÁCH IDOL =====

        // Hàm lấy danh sách idol từ API
        async function getIdolList() {
            const loginInfo = getLoginInfo();
            if (!loginInfo.token) {
                console.error('Cần đăng nhập trước khi lấy danh sách idol!');
                return null;
            }

            const tokenData = getTokenData();
            const uid = tokenData.userId;
            const udid = tokenData.udid || localStorage.getItem('udid') || getGuid();

            const timestamp = new Date().getTime();
            const xSign = md5(`${udid}jgyh,kasd${timestamp}`);

            console.log('🎭 Fetching idol list with:', { uid, udid, timestamp, xSign });

            try {
                const response = await fetch('https://gateway.mmlive.online/live-client/live/new/4231/1529/list', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json, text/plain, */*',
                        'accept-language': 'VI',
                        'appid': 'MMLive',
                        'authorization': `HSBox ${loginInfo.token}`,
                        'content-type': 'application/json;charset=UTF-8',
                        'n-l': 'Y',
                        'origin': 'https://mmlive.online',
                        'os': '0',
                        'p-g': 'N',
                        'priority': 'u=1, i',
                        'referer': 'https://mmlive.online/',
                        'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"macOS"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-site',
                        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                        'x-appversion': '2.5.0',
                        'x-language': 'VI',
                        'x-sign': xSign,
                        'x-timestamp': timestamp.toString(),
                        'x-udid': udid
                    },
                    body: JSON.stringify({
                        "uid": uid,
                        "type": 1,
                        "os": 0
                    })
                });

                const result = await response.json();
                console.log('🎭 Idol list API response:', result);
                console.log('🎭 Response code:', result.code);
                console.log('🎭 Response data:', result.data);
                console.log('🎭 Data type:', typeof result.data);
                console.log('🎭 Data is array:', Array.isArray(result.data));

                if (result.data && result.data.length > 0) {
                    console.log(`✅ Successfully fetched ${result.data.length} idols`);
                    console.log('🎭 First idol sample:', result.data[0]);
                    return result.data;
                } else {
                    console.error('❌ Failed to fetch idol list:', result.message || result.msg);
                    return null;
                }
            } catch (error) {
                console.error('❌ Error fetching idol list:', error);
                return null;
            }
        }

        // Hàm render danh sách idol từ API
        function renderApiIdolList(idols) {
            const idolListContainer = document.getElementById('idolGrid');
            if (!idolListContainer) {
                console.error('❌ Cannot find idolGrid element');
                return;
            }

            // FIX: Xử lý hiển thị thông báo "Không có dữ liệu" rõ ràng hơn
            if (!idols || !Array.isArray(idols) || idols.length === 0) {
                console.log('⚠️ No idols to render');
                idolListContainer.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.8); padding: 50px; display:flex; flex-direction:column; align-items:center;">
                        <span style="font-size:3rem; margin-bottom:15px;">📭</span>
                        <h3 style="margin:0;">Chưa có dữ liệu Idol</h3>
                        <p style="margin-top:5px; opacity:0.7;">Danh sách trống hoặc lỗi kết nối.</p>
                    </div>`;
                return;
            }

            // Lưu data để sử dụng trong selectApiIdol
            apiIdolsData = idols;

            // Lưu dữ liệu gốc cho search (chỉ lần đầu)
            if (originalIdolsData.length === 0) {
                originalIdolsData = [...idols];
                console.log('💾 Saved original idols data for search');
            }

            // Debug: Log sample idol structure
            console.log('🔍 Sample idol data structure:', idols[0]);
            console.log('🔍 Available fields:', Object.keys(idols[0] || {}));

            let html = '';
            idols.forEach((idol, index) => {
                html += `
                    <div class="idol-card" onclick="selectApiIdolByAnchorId('${idol.anchorId}')" data-idol-index="${index}" data-idol-id="${idol.anchorId}">
                        <img src="${idol.avatar}" alt="${idol.nickname || idol.nickName}" class="idol-avatar-img" onerror="this.src='https://ui-avatars.com/api/?name=Idol'">
                        <div class="idol-name">${idol.nickname || idol.nickName}</div>
                        <div class="idol-desc">${idol.signature || 'No description'}</div>
                        <div style="display:flex; justify-content:center; gap:5px; margin-top:5px;">
                            ${idol.liveStatus === 1 ? '<span class="status-pill status-live">🔴 LIVE</span>' : '<span class="status-pill status-offline">⚫ OFF</span>'}
                            <span class="status-pill" style="background:#f1f2f6; color:#555">ID: ${idol.anchorId}</span>
                        </div>
                    </div>
                `;
            });

            idolListContainer.innerHTML = html;
            console.log(`✅ Rendered ${idols.length} idols`);

            // Setup search input events (chỉ setup một lần)
            setupSearchInput();

            // Update search results count
            if (currentSearchTerm) {
                updateSearchResultsCount(idols.length, originalIdolsData.length, currentSearchTerm);
            } else {
                updateSearchResultsCount(idols.length, originalIdolsData.length || idols.length);
            }

            // Update selection UI sau khi render
            setTimeout(() => {
                updateIdolCardSelection();
                console.log('🔄 Updated idol card selection after render');
            }, 100);

            // Tự động chọn idol đầu tiên nếu chưa có idol nào được chọn
            if (!selectedIdol && idols.length > 0) {
                const firstIdol = {
                    id: idols[0].anchorId, // Sử dụng anchorId làm id chính
                    nickname: idols[0].nickname || idols[0].nickName,
                    signature: idols[0].signature || idols[0].desc || 'Chưa có mô tả',
                    avatar: idols[0].avatar,
                    liveId: idols[0].liveId || idols[0].anchorId,
                    anchorId: idols[0].anchorId, // anchorId từ API
                    liveStatus: idols[0].liveStatus
                };
                selectIdol(firstIdol);
                console.log(`🎯 Auto-selected first idol: ${firstIdol.nickname}`);

                // Force update selection UI after auto-select
                setTimeout(() => {
                    updateIdolCardSelection();
                    console.log('🔄 Force updated selection after auto-select');
                }, 200);
            }
        }

        // Lưu trữ idol data từ API
        let apiIdolsData = [];

        // Function chọn idol từ API theo index (legacy support)
        function selectApiIdol(index) {
            console.log(`🎯 selectApiIdol called with index: ${index}`);
            if (index >= 0 && index < apiIdolsData.length) {
                const idol = apiIdolsData[index];
                selectApiIdolByAnchorId(idol.anchorId);
            }
        }

        // Function chọn idol từ API theo anchorId (search-friendly)
        function selectApiIdolByAnchorId(anchorId) {
            console.log(`🎯 selectApiIdolByAnchorId called with anchorId: ${anchorId}`);

            // Tìm idol trong originalIdolsData (data gốc) để đảm bảo luôn tìm thấy
            const searchData = originalIdolsData.length > 0 ? originalIdolsData : apiIdolsData;
            const idol = searchData.find(idol => String(idol.anchorId) === String(anchorId));

            if (idol) {
                console.log(`🎯 Found idol data:`, idol);

                const idolObj = {
                    id: idol.anchorId, // Sử dụng anchorId làm id chính
                    nickname: idol.nickname || idol.nickName,
                    avatar: idol.avatar,
                    liveId: idol.liveId || idol.anchorId,
                    anchorId: idol.anchorId, // anchorId từ API
                    signature: idol.signature || idol.desc || 'Chưa có mô tả', // Thêm signature field
                    liveStatus: idol.liveStatus
                };

                console.log(`🎯 Created idolObj:`, idolObj);
                selectIdol(idolObj);

                // Force update selection với delay
                setTimeout(() => {
                    console.log('🔄 Force updating selection after click');
                    updateIdolCardSelection();
                }, 50);
            } else {
                console.error(`❌ Could not find idol with anchorId: ${anchorId}`);
            }
        }

        // ===== SEARCH FUNCTIONS =====

        // Biến lưu trữ dữ liệu gốc và kết quả search
        let originalIdolsData = [];
        let currentSearchTerm = '';

        // Hàm tìm kiếm idol
        function searchIdols() {
            const searchInput = document.getElementById('idolSearchInput');
            const searchTerm = searchInput.value.trim().toLowerCase();

            if (!apiIdolsData || apiIdolsData.length === 0) {
                updateSearchResultsCount(0, 0, 'Chưa có dữ liệu idol');
                return;
            }

            // Lưu dữ liệu gốc lần đầu
            if (originalIdolsData.length === 0) {
                originalIdolsData = [...apiIdolsData];
            }

            currentSearchTerm = searchTerm;

            if (!searchTerm) {
                // Nếu không có từ khóa, hiển thị tất cả
                renderApiIdolList(originalIdolsData);
                updateSearchResultsCount(originalIdolsData.length, originalIdolsData.length);
                return;
            }

            console.log('🔍 Searching for:', searchTerm);

            // Tìm kiếm theo tên, nickname và ID
            const searchResults = originalIdolsData.filter(idol => {
                const nickname = (idol.nickname || idol.nickName || '').toLowerCase();
                const anchorId = String(idol.anchorId || '').toLowerCase();
                const signature = (idol.signature || idol.desc || '').toLowerCase();

                return nickname.includes(searchTerm) ||
                    anchorId.includes(searchTerm) ||
                    signature.includes(searchTerm);
            });

            console.log(`🔍 Found ${searchResults.length} results for "${searchTerm}"`);

            // Render kết quả tìm kiếm
            renderApiIdolList(searchResults);
            updateSearchResultsCount(searchResults.length, originalIdolsData.length, searchTerm);
        }

        // Hàm xóa search
        function clearSearch() {
            const searchInput = document.getElementById('idolSearchInput');
            searchInput.value = '';
            currentSearchTerm = '';

            // Hiển thị lại tất cả idol
            if (originalIdolsData.length > 0) {
                renderApiIdolList(originalIdolsData);
                updateSearchResultsCount(originalIdolsData.length, originalIdolsData.length);
            }

            console.log('🗑️ Search cleared, showing all idols');
        }

        // Hàm cập nhật số lượng kết quả tìm kiếm
        function updateSearchResultsCount(found, total, searchTerm = '') {
            const countElement = document.getElementById('searchResultsCount');
            if (!countElement) return;

            if (searchTerm && searchTerm !== '') {
                if (found === 0) {
                    countElement.innerHTML = `❌ Không tìm thấy kết quả cho "<strong>${searchTerm}</strong>"`;
                    countElement.style.color = '#dc3545';
                } else {
                    countElement.innerHTML = `✅ Tìm thấy <strong>${found}</strong> kết quả cho "<strong>${searchTerm}</strong>" (từ ${total} idol)`;
                    countElement.style.color = '#28a745';
                }
            } else {
                countElement.innerHTML = `📋 Hiển thị tất cả <strong>${total}</strong> idol`;
                countElement.style.color = '#6c757d';
            }
        }

        // Hàm search realtime khi gõ
        function setupSearchInput() {
            const searchInput = document.getElementById('idolSearchInput');
            if (searchInput) {
                // Search khi nhấn Enter
                searchInput.addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') {
                        searchIdols();
                    }
                });

                // Search realtime với debounce
                let searchTimeout;
                searchInput.addEventListener('input', function (e) {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        searchIdols();
                    }, 300); // Delay 300ms để tránh search quá nhiều
                });
            }
        }

        // ===== SCRIPT FUNCTIONS (Deleted as requested) =====

        // Hàm detect hệ điều hành
        function detectOS() {
            const userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.indexOf('win') !== -1) return 'windows';
            if (userAgent.indexOf('mac') !== -1) return 'macos';
            if (userAgent.indexOf('linux') !== -1) return 'linux';
            return 'unix'; // default
        }

        // ===== CHẠY TRỰC TIẾP TRÊN TRÌNH DUYỆT =====
        let isRunning = false;
        let shouldStop = false;

        // Hàm chạy trực tiếp các requests (TĂNG TỐC với parallel requests)
        async function runDirectly(numberOfRequests = 1000, delaySeconds = 0.01, concurrentRequests = 10) {
            if (isRunning) {
                alert('Đang có tiến trình chạy khác! Vui lòng chờ hoàn thành hoặc dừng lại.');
                return;
            }

            const loginInfo = getLoginInfo();
            if (!loginInfo.token) {
                alert('Cần đăng nhập trước khi chạy!');
                return;
            }

            // Hiển thị panel kết quả
            showRunResultsPanel();

            // Reset trạng thái
            isRunning = true;
            shouldStop = false;

            // Get values from config and token
            const liveId = GLOBAL_CONFIG.liveId;
            const anchorId = GLOBAL_CONFIG.anchorId;
            const uid = getTokenData().userId || Math.floor(Math.random() * 999999999) + 2000000000;
            const udid = getTokenData().udid || localStorage.getItem('udid') || getGuid();

            console.log('Direct Run Config - LiveID:', liveId, 'AnchorID:', anchorId, 'UID:', uid);
            console.log(`⚡ TURBO MODE: ${concurrentRequests} requests song song`);

            // Update progress
            updateProgress(0, numberOfRequests, 'Đang bắt đầu...');
            logResult(`🚀 Bắt đầu chạy ${numberOfRequests} requests (${concurrentRequests} requests đồng thời)...`, 'info');
            logResult(`📊 Config: LiveID=${liveId}, AnchorID=${anchorId}, UID=${uid}`, 'info');

            let successCount = 0;
            let errorCount = 0;
            let completedCount = 0;
            const startTime = Date.now();

            // Hàm gửi 1 request
            const sendRequest = async (index) => {
                if (shouldStop) return { success: false, stopped: true };

                try {
                    const timestamp = new Date().getTime() + index * 10;
                    const xSign = md5(`${udid}jgyh,kasd${timestamp}`);
                    const randomRoomId = 220;

                    // Gửi request
                    const response = await fetch(`https://gateway.mmlive.online/live-client/live/inter/room/${randomRoomId}`, {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json, text/plain, */*',
                            'accept-language': 'VI',
                            'appid': 'MMLive',
                            'authorization': `HSBox ${loginInfo.token}`,
                            'content-type': 'application/json;charset=UTF-8',
                            'n-l': 'Y',
                            'new-pk': '1',
                            'origin': 'https://mmlive.online',
                            'os': '0',
                            'p-g': 'N',
                            'referer': 'https://mmlive.online/',
                            'x-appversion': '2.5.0',
                            'x-language': 'VI',
                            'x-sign': xSign,
                            'x-timestamp': timestamp,
                            'x-udid': udid
                        },
                        body: JSON.stringify({
                            liveId: liveId,
                            uid: uid,
                            adJumpUrl: "",
                            anchorId: anchorId,
                            isRoomPreview: 0,
                            os: 0
                        })
                    });

                    if (response.ok) {
                        await response.json();
                        return { success: true, index, roomId: randomRoomId };
                    } else {
                        return { success: false, index, roomId: randomRoomId, status: response.status };
                    }

                } catch (error) {
                    return { success: false, index, error: error.message };
                }
            };

            // Chạy requests theo batch (song song)
            for (let batchStart = 1; batchStart <= numberOfRequests && !shouldStop; batchStart += concurrentRequests) {
                const batchEnd = Math.min(batchStart + concurrentRequests - 1, numberOfRequests);
                const batchSize = batchEnd - batchStart + 1;

                updateProgress(completedCount, numberOfRequests, `Đang gửi batch ${Math.ceil(batchStart / concurrentRequests)}...`, batchSize);

                // Tạo mảng promises cho batch này
                const promises = [];
                for (let i = 0; i < batchSize; i++) {
                    promises.push(sendRequest(batchStart + i));
                }

                // Chờ tất cả requests trong batch hoàn thành
                const results = await Promise.all(promises);

                // Xử lý kết quả
                results.forEach((result, idx) => {
                    if (result.stopped) return;

                    completedCount++;

                    if (result.success) {
                        successCount++;
                        // Chỉ log mỗi 50 requests để tránh spam
                        if (completedCount % 50 === 0 || completedCount <= 10) {
                            logResult(`✅ Request ${result.index}: Thành công`, 'success');
                        }
                    } else {
                        errorCount++;
                        logResult(`❌ Request ${result.index}: ${result.status ? `HTTP ${result.status}` : result.error}`, 'error');
                    }
                });

                // Cập nhật progress sau mỗi batch
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                const rate = (completedCount / (Date.now() - startTime) * 1000).toFixed(1);
                updateProgress(completedCount, numberOfRequests, `Hoàn thành ${completedCount}/${numberOfRequests} (${rate} req/s)`, 0);

                // Delay nhỏ giữa các batch (nếu cần)
                if (batchEnd < numberOfRequests && delaySeconds > 0 && !shouldStop) {
                    await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
                }
            }

            // Hoàn thành
            isRunning = false;
            const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
            const avgRate = (completedCount / (Date.now() - startTime) * 1000).toFixed(1);

            updateProgress(numberOfRequests, numberOfRequests, shouldStop ? 'Đã dừng lại' : 'Hoàn thành!');

            const statusText = shouldStop ? 'Đã dừng lại' : 'Hoàn thành';
            logResult(`\n🏁 ${statusText}! Tổng kết:`, 'info');
            logResult(`   ✅ Thành công: ${successCount}`, 'success');
            logResult(`   ❌ Lỗi: ${errorCount}`, 'error');
            logResult(`   ⏱️ Thời gian: ${totalTime}s`, 'info');
            logResult(`   ⚡ Tốc độ trung bình: ${avgRate} requests/giây`, 'info');
            logResult(`   📊 Tỉ lệ thành công: ${((successCount / (successCount + errorCount)) * 100).toFixed(1)}%`, 'info');

            document.getElementById('stopBtn').style.display = 'none';
        }

        // Hiển thị panel kết quả
        function showRunResultsPanel() {
            const panel = document.getElementById('runResultsPanel');
            panel.style.display = 'block';
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Hiển thị nút stop
            document.getElementById('stopBtn').style.display = 'inline-block';

            // Clear previous results
            document.getElementById('runResults').innerHTML = '';
        }

        // Cập nhật thanh progress
        function updateProgress(current, total, message, activeThreads = 0) {
            const percentage = total > 0 ? (current / total) * 100 : 0;

            document.getElementById('progressBar').style.width = percentage + '%';

            // Thêm hiển thị threads nếu có
            const messageWithThreads = activeThreads > 0 ? `${message} [${activeThreads} threads hoạt động]` : message;
            document.getElementById('progressText').textContent = messageWithThreads;
            document.getElementById('progressCount').textContent = `${current}/${total}`;
        }

        // Ghi log kết quả
        function logResult(message, type = 'info') {
            const resultsDiv = document.getElementById('runResults');
            const timestamp = new Date().toLocaleTimeString();

            let color = '#a4b0be';
            if (type === 'success') color = '#55efc4';
            else if (type === 'error') color = '#ff7675';
            else if (type === 'info') color = '#74b9ff';

            const logEntry = document.createElement('div');
            logEntry.style.color = color;
            logEntry.style.marginBottom = '3px';
            logEntry.innerHTML = `<span style="color: #636e72;">[${timestamp}]</span> ${message}`;

            resultsDiv.appendChild(logEntry);
            resultsDiv.scrollTop = resultsDiv.scrollHeight;
        }

        // Dừng chạy
        function stopRunning() {
            if (isRunning) {
                shouldStop = true;
                logResult('🛑 Đang dừng lại...', 'info');
                document.getElementById('stopBtn').style.display = 'none';
            }
        }

        // Xóa kết quả
        function clearResults() {
            document.getElementById('runResults').innerHTML = '';
            document.getElementById('runResultsPanel').style.display = 'none';
            // document.getElementById('toolPlaceholder').style.display = 'block'; // Removed since placeholder was in deleted column
            updateProgress(0, 0, 'Sẵn sàng');
        }

        // Wrapper function để chạy TURBO MODE với input từ user
        async function runTurboModeWithInput() {
            const numberOfViews = parseInt(document.getElementById('customRequests').value) || 5000;
            const maxConcurrent = 150; // Fixed 150 threads cho TURBO MODE
            await runTurboMode(numberOfViews, maxConcurrent);
        }

        // TURBO MODE - Chạy với Promise Pool để tối ưu hiệu suất cực đại
        async function runTurboMode(numberOfRequests = 5000, maxConcurrent = 150) {
            if (isRunning) {
                alert('Đang có tiến trình chạy khác! Vui lòng chờ hoàn thành hoặc dừng lại.');
                return;
            }

            const confirmed = confirm(`🚀 TURBO MODE\n\n⚡ Sẽ chạy ${numberOfRequests} requests với ${maxConcurrent} threads đồng thời!\n\n⚠️ Cảnh báo:\n- Tốc độ CỰC NHANH (có thể > 1000 req/s)\n- Có thể làm trình duyệt lag tạm thời\n- Server có thể chặn rate limit\n\nChỉ dùng khi server cho phép rate cao!\n\nTiếp tục?`);

            if (!confirmed) return;

            const loginInfo = getLoginInfo();
            if (!loginInfo.token) {
                alert('Cần đăng nhập trước khi chạy!');
                return;
            }

            showRunResultsPanel();
            isRunning = true;
            shouldStop = false;

            const liveId = GLOBAL_CONFIG.liveId;
            const anchorId = GLOBAL_CONFIG.anchorId;
            const uid = getTokenData().userId || Math.floor(Math.random() * 999999999) + 2000000000;
            const udid = getTokenData().udid || localStorage.getItem('udid') || getGuid();

            logResult(`🚀 TURBO MODE: ${numberOfRequests} requests với ${maxConcurrent} threads!`, 'info');
            logResult(`📊 Config: LiveID=${liveId}, AnchorID=${anchorId}`, 'info');

            let successCount = 0;
            let errorCount = 0;
            let completedCount = 0;
            const startTime = Date.now();

            // Promise pool để kiểm soát concurrency
            const pool = [];
            const results = [];

            const sendRequest = async (index) => {
                if (shouldStop) return { success: false, stopped: true };

                try {
                    const timestamp = new Date().getTime() + index * 5;
                    const xSign = md5(`${udid}jgyh,kasd${timestamp}`);
                    const randomRoomId = 220;

                    const response = await fetch(`https://gateway.mmlive.online/live-client/live/inter/room/${randomRoomId}`, {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json, text/plain, */*',
                            'accept-language': 'VI',
                            'appid': 'MMLive',
                            'authorization': `HSBox ${loginInfo.token}`,
                            'content-type': 'application/json;charset=UTF-8',
                            'n-l': 'Y',
                            'new-pk': '1',
                            'origin': 'https://mmlive.online',
                            'os': '0',
                            'p-g': 'N',
                            'referer': 'https://mmlive.online/',
                            'x-appversion': '2.5.0',
                            'x-language': 'VI',
                            'x-sign': xSign,
                            'x-timestamp': timestamp,
                            'x-udid': udid
                        },
                        body: JSON.stringify({
                            liveId: liveId,
                            uid: uid,
                            adJumpUrl: "",
                            anchorId: anchorId,
                            isRoomPreview: 0,
                            os: 0
                        })
                    });

                    completedCount++;

                    if (response.ok) {
                        await response.json();
                        successCount++;
                        return { success: true, index };
                    } else {
                        errorCount++;
                        return { success: false, index, status: response.status };
                    }
                } catch (error) {
                    completedCount++;
                    errorCount++;
                    return { success: false, index, error: error.message };
                }
            };

            // Chạy với promise pool
            for (let i = 1; i <= numberOfRequests && !shouldStop; i++) {
                const promise = sendRequest(i).then(result => {
                    // Remove from pool when done
                    const index = pool.indexOf(promise);
                    if (index > -1) pool.splice(index, 1);

                    // Update progress mỗi 100 requests
                    if (completedCount % 100 === 0) {
                        const rate = (completedCount / (Date.now() - startTime) * 1000).toFixed(0);
                        updateProgress(completedCount, numberOfRequests, `Turbo Mode: ${rate} req/s`, pool.length);
                    }
                    return result;
                });

                pool.push(promise);

                // Khi pool đầy, chờ một request hoàn thành
                if (pool.length >= maxConcurrent) {
                    await Promise.race(pool);
                }
            }

            // Chờ tất cả requests còn lại
            if (pool.length > 0) {
                await Promise.all(pool);
            }

            // Hoàn thành
            isRunning = false;
            const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
            const avgRate = (completedCount / (Date.now() - startTime) * 1000).toFixed(0);

            updateProgress(numberOfRequests, numberOfRequests, 'TURBO MODE hoàn thành!', 0);

            logResult(`\n🏁 TURBO MODE hoàn thành!`, 'info');
            logResult(`   ✅ Thành công: ${successCount}`, 'success');
            logResult(`   ❌ Lỗi: ${errorCount}`, 'error');
            logResult(`   ⏱️ Thời gian: ${totalTime}s`, 'info');
            logResult(`   ⚡ Tốc độ trung bình: ${avgRate} requests/giây`, 'info');
            logResult(`   📊 Tỉ lệ thành công: ${((successCount / completedCount) * 100).toFixed(1)}%`, 'info');

            document.getElementById('stopBtn').style.display = 'none';
        }

        // PHÁ IDOL MODE - Chạy vòng lặp không giới hạn với 5000 requests, 150 threads
        async function runPhaIdolMode() {
            if (isRunning) {
                alert('Đang có tiến trình chạy khác! Vui lòng chờ hoàn thành hoặc dừng lại.');
                return;
            }

            const confirmed = confirm(`💥 CHẾ ĐỘ PHÁ IDOL\n\n🔥 Chạy VÒNG LẶP KHÔNG GIỚI HẠN!\n⚡ Mỗi vòng: 5000 requests với 150 threads\n\n⚠️ CẢNH BÁO CỰC MẠNH:\n- Chạy LIÊN TỤC cho đến khi bạn dừng\n- Tốc độ CỰC NHANH (> 1000 req/s)\n- Có thể làm trình duyệt lag nghiêm trọng\n- Server có thể chặn IP\n- CHỈ DỪNG KHI BẠN NHẤN NÚT DỪNG!\n\n⛔ CHỈ DÙNG KHI THẬT SỰ CẦN THIẾT!\n\nBạn có chắc chắn muốn tiếp tục?`);

            if (!confirmed) return;

            const loginInfo = getLoginInfo();
            if (!loginInfo.token) {
                alert('Cần đăng nhập trước khi chạy!');
                return;
            }

            showRunResultsPanel();
            isRunning = true;
            shouldStop = false;

            const liveId = GLOBAL_CONFIG.liveId;
            const anchorId = GLOBAL_CONFIG.anchorId;
            const uid = getTokenData().userId || Math.floor(Math.random() * 999999999) + 2000000000;
            const udid = getTokenData().udid || localStorage.getItem('udid') || getGuid();

            logResult(`💥 CHẾ ĐỘ PHÁ IDOL BẮT ĐẦU!`, 'error');
            logResult(`🔥 Vòng lặp không giới hạn - 5000 requests/vòng - 150 threads`, 'error');
            logResult(`📊 Config: LiveID=${liveId}, AnchorID=${anchorId}`, 'info');
            logResult(`⚠️ Nhấn nút DỪNG để kết thúc!\n`, 'info');

            let totalSuccessCount = 0;
            let totalErrorCount = 0;
            let totalCompletedCount = 0;
            let loopCount = 0;
            const globalStartTime = Date.now();

            // Vòng lặp không giới hạn
            while (!shouldStop) {
                loopCount++;
                logResult(`\n🔄 === VÒNG ${loopCount} BẮT ĐẦU ===`, 'info');

                const numberOfRequests = 5000;
                const maxConcurrent = 150;

                let successCount = 0;
                let errorCount = 0;
                let completedCount = 0;
                const startTime = Date.now();

                // Promise pool để kiểm soát concurrency
                const pool = [];

                const sendRequest = async (index) => {
                    if (shouldStop) return { success: false, stopped: true };

                    try {
                        const timestamp = new Date().getTime() + index * 5;
                        const xSign = md5(`${udid}jgyh,kasd${timestamp}`);
                        const randomRoomId = 220;

                        const response = await fetch(`https://gateway.mmlive.online/live-client/live/inter/room/${randomRoomId}`, {
                            method: 'POST',
                            headers: {
                                'accept': 'application/json, text/plain, */*',
                                'accept-language': 'VI',
                                'appid': 'MMLive',
                                'authorization': `HSBox ${loginInfo.token}`,
                                'content-type': 'application/json;charset=UTF-8',
                                'n-l': 'Y',
                                'new-pk': '1',
                                'origin': 'https://mmlive.online',
                                'os': '0',
                                'p-g': 'N',
                                'referer': 'https://mmlive.online/',
                                'x-appversion': '2.5.0',
                                'x-language': 'VI',
                                'x-sign': xSign,
                                'x-timestamp': timestamp,
                                'x-udid': udid
                            },
                            body: JSON.stringify({
                                liveId: liveId,
                                uid: uid,
                                adJumpUrl: "",
                                anchorId: anchorId,
                                isRoomPreview: 0,
                                os: 0
                            })
                        });

                        completedCount++;
                        totalCompletedCount++;

                        if (response.ok) {
                            await response.json();
                            successCount++;
                            totalSuccessCount++;
                            return { success: true, index };
                        } else {
                            errorCount++;
                            totalErrorCount++;
                            return { success: false, index, status: response.status };
                        }
                    } catch (error) {
                        completedCount++;
                        totalCompletedCount++;
                        errorCount++;
                        totalErrorCount++;
                        return { success: false, index, error: error.message };
                    }
                };

                // Chạy với promise pool
                for (let i = 1; i <= numberOfRequests && !shouldStop; i++) {
                    const promise = sendRequest(i).then(result => {
                        // Remove from pool when done
                        const index = pool.indexOf(promise);
                        if (index > -1) pool.splice(index, 1);

                        // Update progress mỗi 100 requests
                        if (completedCount % 100 === 0) {
                            const rate = (completedCount / (Date.now() - startTime) * 1000).toFixed(0);
                            const globalRate = (totalCompletedCount / (Date.now() - globalStartTime) * 1000).toFixed(0);
                            updateProgress(completedCount, numberOfRequests, `💥 Phá Idol Vòng ${loopCount}: ${rate} req/s | Tổng: ${globalRate} req/s`, pool.length);
                        }
                        return result;
                    });

                    pool.push(promise);

                    // Khi pool đầy, chờ một request hoàn thành
                    if (pool.length >= maxConcurrent) {
                        await Promise.race(pool);
                    }
                }

                // Chờ tất cả requests còn lại của vòng này
                if (pool.length > 0) {
                    await Promise.all(pool);
                }

                // Kết thúc vòng lặp
                const loopTime = ((Date.now() - startTime) / 1000).toFixed(2);
                const loopRate = (completedCount / (Date.now() - startTime) * 1000).toFixed(0);

                logResult(`🏁 Vòng ${loopCount} hoàn thành!`, 'success');
                logResult(`   ✅ Thành công: ${successCount} | ❌ Lỗi: ${errorCount}`, 'info');
                logResult(`   ⏱️ Thời gian: ${loopTime}s | ⚡ Tốc độ: ${loopRate} req/s`, 'info');

                // Nếu shouldStop = true, thoát vòng lặp
                if (shouldStop) {
                    logResult(`\n⛔ Đã dừng bởi người dùng!`, 'error');
                    break;
                }

                // Delay nhỏ giữa các vòng (100ms) để tránh quá tải
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Hoàn thành toàn bộ
            isRunning = false;
            const totalTime = ((Date.now() - globalStartTime) / 1000).toFixed(2);
            const avgRate = (totalCompletedCount / (Date.now() - globalStartTime) * 1000).toFixed(0);

            updateProgress(totalCompletedCount, totalCompletedCount, 'PHÁ IDOL MODE HOÀN THÀNH!', 0);

            logResult(`\n💥 === KẾT THÚC CHẾ ĐỘ PHÁ IDOL ===`, 'error');
            logResult(`🔄 Tổng số vòng: ${loopCount}`, 'info');
            logResult(`📊 TỔNG KẾT:`, 'info');
            logResult(`   ✅ Thành công: ${totalSuccessCount}`, 'success');
            logResult(`   ❌ Lỗi: ${totalErrorCount}`, 'error');
            logResult(`   📈 Tổng requests: ${totalCompletedCount}`, 'info');
            logResult(`   ⏱️ Tổng thời gian: ${totalTime}s`, 'info');
            logResult(`   ⚡ Tốc độ trung bình: ${avgRate} requests/giây`, 'info');
            logResult(`   📊 Tỉ lệ thành công: ${((totalSuccessCount / totalCompletedCount) * 100).toFixed(1)}%`, 'info');

            document.getElementById('stopBtn').style.display = 'none';
        }

        // Toggle hiển thị mật khẩu
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const passwordToggle = document.querySelector('.password-toggle');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordToggle.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                passwordToggle.textContent = '👁️';
            }
        }

        // Validate form
        function validateForm() {
            const mobile = document.getElementById('email');
            const password = document.getElementById('password');
            const mobileError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');

            let isValid = true;

            // Reset errors
            mobileError.style.display = 'none';
            passwordError.style.display = 'none';
            mobile.style.borderColor = '#e1e1e1';
            password.style.borderColor = '#e1e1e1';

            // Validate mobile phone (Vietnam format)
            const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
            if (!mobile.value.trim() || !phoneRegex.test(mobile.value.trim())) {
                mobileError.style.display = 'block';
                mobile.style.borderColor = '#dc3545';
                isValid = false;
            }

            // Validate password
            if (!password.value || password.value.length < 6) {
                passwordError.style.display = 'block';
                password.style.borderColor = '#dc3545';
                isValid = false;
            }

            return isValid;
        }

        // Xử lý submit form
        document.getElementById('loginForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            if (validateForm()) {
                // Hiển thị loading
                const loginBtn = document.querySelector('.login-btn');
                const originalText = loginBtn.textContent;
                loginBtn.textContent = 'Đang đăng nhập...';
                loginBtn.disabled = true;

                // Lấy dữ liệu từ form
                const mobile = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;
                const remember = document.getElementById('remember').checked; // Lấy trạng thái checkbox ghi nhớ

                try {
                    // Gọi API đăng nhập
                    console.log('📞 Calling loginAPI...');
                    const result = await loginAPI(mobile, password);
                    console.log('📨 Received result from loginAPI:', result);
                    console.log('Result type:', typeof result);

                    // Kiểm tra result có tồn tại không
                    if (!result) {
                        console.error('❌ Không nhận được phản hồi từ server - result is:', result);
                        alert('🚨 Lỗi server!\n\n⚠️ Không nhận được phản hồi từ server.\nVui lòng thử lại sau.');
                        return;
                    }

                    if (result.success === true) {
                        console.log(`Đăng nhập thành công! ${result.message || 'Success'}`);

                        // XỬ LÝ GHI NHỚ ĐĂNG NHẬP
                        if (remember) {
                            localStorage.setItem('savedMobile', mobile);
                            // Mã hóa đơn giản mật khẩu (base64) để không lưu plaintext
                            localStorage.setItem('savedPassword', btoa(password));
                            localStorage.setItem('isRemembered', 'true');
                        } else {
                            // Nếu không check thì xóa thông tin cũ
                            localStorage.removeItem('savedMobile');
                            localStorage.removeItem('savedPassword');
                            localStorage.removeItem('isRemembered');
                        }

                        // Hiển thị thông tin đã lưu
                        console.log('Token saved:', localStorage.getItem('authToken'));
                        console.log('Random Key:', localStorage.getItem('randomKey'));
                        console.log('Random Vector:', localStorage.getItem('randomVector'));
                        console.log('Login Time:', localStorage.getItem('loginTime'));

                        // Cập nhật User Info UI
                        updateUserInfoDisplay();

                        // Lấy thông tin chi tiết user và danh sách idol
                        try {
                            console.log('🔍 Fetching user profile information...');
                            const userDetail = await getUserInfo();
                            if (userDetail) {
                                updateUserInfoDisplay(userDetail);
                                console.log('✅ Fetched user detail:', userDetail.nickname);
                            }

                            // Lấy danh sách idol
                            console.log('🎭 Fetching idol list...');
                            const idols = await getIdolList();
                            console.log('🎭 Received idols from API:', idols);
                            console.log('🎭 Idols type:', typeof idols);
                            console.log('🎭 Idols length:', idols ? idols.length : 'null');

                            if (idols) {
                                console.log('🎨 Calling renderApiIdolList...');
                                renderApiIdolList(idols);
                                console.log('✅ Successfully loaded idol list');
                            } else {
                                console.log('❌ No idols received from API');
                                // FIX: Gọi render để hiện thông báo trống
                                renderApiIdolList([]);
                            }
                        } catch (error) {
                            console.error('❌ Error fetching user data or idol list:', error);
                            // FIX: Gọi render để hiện thông báo trống
                            renderApiIdolList([]);
                        }

                        // Ẩn toàn bộ login container
                        document.querySelector('.login-container').style.display = 'none';

                        // Show 2 columns: Sidebar and Idol (Middle column removed)
                        document.getElementById('sidebarSection').style.display = 'block';
                        // document.getElementById('toolContainerColumn').style.display = 'block'; // DELETED
                        // Cập nhật mặc định: Nếu là mobile thì switchTab idol, nếu desktop thì hiện hết
                        const idolContainer = document.querySelector('.idol-container');
                        idolContainer.style.display = 'block';

                        // MOBILE TAB INITIALIZATION
                        if (window.innerWidth <= 992) {
                            switchMobileTab('idol'); // Mặc định vào tab Idol
                        } else {
                            document.getElementById('idolSection').style.display = 'flex'; // Reset cho desktop
                        }

                        // Render danh sách idol
                        renderIdolList();                        // Hiển thị thông báo với token (chỉ để test)
                        if (result.data && result.data.token) {
                            const shortToken = result.data.token.substring(0, 20) + '...';
                            console.log(`Token đã được lưu: ${shortToken}`);
                        }

                    } else {
                        const errorMsg = result.error || result.message || 'Đăng nhập thất bại';
                        console.error(`Đăng nhập thất bại: ${errorMsg}`);

                        // Hiển thị alert lỗi đăng nhập
                        let alertMessage = '❌ Đăng nhập thất bại!\n\n';

                        // Xử lý các loại lỗi cụ thể
                        if (errorMsg.toLowerCase().includes('password') || errorMsg.toLowerCase().includes('mật khẩu')) {
                            alertMessage += '🔑 Mật khẩu không chính xác.\nVui lòng kiểm tra lại mật khẩu.';
                        } else if (errorMsg.toLowerCase().includes('phone') || errorMsg.toLowerCase().includes('mobile') || errorMsg.toLowerCase().includes('điện thoại')) {
                            alertMessage += '📱 Số điện thoại không tồn tại.\nVui lòng kiểm tra lại số điện thoại.';
                        } else if (errorMsg.toLowerCase().includes('account') || errorMsg.toLowerCase().includes('tài khoản')) {
                            alertMessage += '👤 Tài khoản không hợp lệ.\nVui lòng kiểm tra thông tin đăng nhập.';
                        } else {
                            alertMessage += `📋 Chi tiết lỗi: ${errorMsg}`;
                        }

                        alert(alertMessage);
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    console.error('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!');

                    // Hiển thị alert lỗi kết nối
                    let networkErrorMsg = '🚨 Lỗi kết nối!\n\n';

                    if (error.name === 'TypeError') {
                        networkErrorMsg += '🌐 Không thể kết nối đến server.\nVui lòng kiểm tra kết nối internet của bạn.';
                    } else if (error.name === 'SyntaxError') {
                        networkErrorMsg += '⚠️ Server trả về dữ liệu không hợp lệ.\nVui lòng thử lại sau.';
                    } else {
                        networkErrorMsg += `📋 Chi tiết lỗi: ${error.message || 'Lỗi không xác định'}`;
                    }

                    alert(networkErrorMsg);
                } finally {
                    // Reset nút đăng nhập
                    loginBtn.textContent = originalText;
                    loginBtn.disabled = false;
                }
            }
        });


        // Thêm hiệu ứng khi nhập liệu
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', function () {
                this.parentElement.style.transform = 'scale(1.02)';
            });

            input.addEventListener('blur', function () {
                this.parentElement.style.transform = 'scale(1)';
            });
        });

        // HÀM KIỂM TRA ĐĂNG NHẬP VÀ HIỂN THỊ UI NGAY LẬP TỨC
        // Không chờ window.onload để tránh FOUC (Flash of Unstyled Content)
        function initApp() {
            console.log('🚀 App Initializing...');
            const loginContainer = document.getElementById('loginContainer');
            const sidebar = document.getElementById('sidebarSection');
            const idolContainer = document.querySelector('.idol-container');
            const bottomNav = document.getElementById('mobileBottomNav');
            
            // Lấy thông tin đăng nhập từ localStorage
            const savedMobile = localStorage.getItem('savedMobile');
            const savedPassword = localStorage.getItem('savedPassword');
            const isRemembered = localStorage.getItem('isRemembered') === 'true';
            
            // Xử lý auto-fill form (nếu có)
            if (savedMobile && isRemembered) {
                const emailInput = document.getElementById('email');
                const rememberCheckbox = document.getElementById('remember');
                if (emailInput) emailInput.value = savedMobile;
                if (rememberCheckbox) rememberCheckbox.checked = true;
            }
            
            if (savedPassword && isRemembered) {
                const passInput = document.getElementById('password');
                if (passInput) {
                    try {
                        passInput.value = atob(savedPassword);
                    } catch (e) {
                        console.error('Lỗi giải mã mật khẩu');
                    }
                }
            }

            // KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
            if (isLoggedIn()) {
                console.log('✅ User is logged in. Showing Main UI immediately.');
                
                // Ẩn Login, Hiện Main
                if(loginContainer) loginContainer.style.display = 'none';
                if(sidebar) sidebar.style.display = 'block';
                if(idolContainer) idolContainer.style.display = 'block';

                // MOBILE: MẶC ĐỊNH VÀO TAB IDOL
                if (window.innerWidth <= 992) {
                    switchMobileTab('idol');
                }

                // Tải dữ liệu nền
                const loginInfo = getLoginInfo();
                updateUserInfoDisplay();

                (async () => {
                    try {
                        const userDetail = await getUserInfo();
                        if (userDetail) updateUserInfoDisplay(userDetail);
                        
                        const idols = await getIdolList();
                        if (idols) {
                            renderApiIdolList(idols);
                        } else {
                            // FIX: Gọi render để hiện thông báo trống nếu API lỗi/trả về null
                            renderApiIdolList([]);
                        }
                    } catch (error) {
                        console.error('Error loading initial data:', error);
                        // FIX: Gọi render để hiện thông báo trống
                        renderApiIdolList([]);
                    }
                })();

            } else {
                console.log('ℹ️ User not logged in. Showing Login UI.');
                // Hiện Login, Ẩn Main
                if(loginContainer) loginContainer.style.display = 'block'; // Hiện lại login
                if(sidebar) sidebar.style.display = 'none';
                if(idolContainer) idolContainer.style.display = 'none';
                
                // Auto focus nếu chưa có sđt
                const emailInput = document.getElementById('email');
                if (emailInput && (!savedMobile || !isRemembered)) {
                    // Dùng setTimeout nhỏ để đảm bảo render xong mới focus
                    setTimeout(() => emailInput.focus(), 100);
                }
                
                // Render placeholder cho list idol (ẩn trong màn login nhưng chuẩn bị sẵn)
                renderIdolList();
            }

            // Setup search events
            setupSearchInput();
        }

        // CHẠY INIT APP NGAY LẬP TỨC (Khi script được parse)
        initApp();

    </script>
</body>

</html>
