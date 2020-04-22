    // 将字符串解析为 utf8 字节 类似于 new TextEncoder()
    function encode_utf8_str(str) {
      let charArray = [];
      for (const char of str) {
        let charBits = char.codePointAt(0).toString(2);
        let byteLen;
        const charBitsLen = charBits.length;
        if (charBitsLen < 8) {
          while (charBits.length !== 8) {
            charBits = '0' + charBits;
          }
          byteLen = 1;
        } else if (charBitsLen < 12) {
          while (charBits.length !== 11) {
            charBits = '0' + charBits;
          }
          byteLen = 2;
        } else if (charBitsLen < 17) {
          while (charBits.length !== 16) {
            charBits = '0' + charBits;
          }
          byteLen = 3;
        } else if (charBitsLen < 22) {
          while (charBits.length !== 21) {
            charBits = '0' + charBits;
          }
          byteLen = 4;
        } else {
          console.error('字节太大，不支持 utf8 编码格式');
          return;
        }

        const arrBuf = new ArrayBuffer(byteLen);
        const uintArr = new Uint8Array(arrBuf);
        if (byteLen === 1) {
          uintArr[0] = parseInt(charBits, 2);
        } else if (byteLen === 2) {
          uintArr[0] = parseInt(`110${charBits.substr(0, 5)}`, 2);
          uintArr[1] = parseInt(`10${charBits.substr(5)}`, 2);
        } else if (byteLen === 3) {
          uintArr[0] = parseInt(`1110${charBits.substr(0, 4)}`, 2);
          uintArr[1] = parseInt(`10${charBits.substr(4, 6)}`, 2);
          uintArr[2] = parseInt(`10${charBits.substr(10)}`, 2);
        } else if (byteLen === 4) {
          uintArr[0] = parseInt(`11110${charBits.substr(0, 3)}`, 2);
          uintArr[1] = parseInt(`10${charBits.substr(3, 6)}`, 2);
          uintArr[2] = parseInt(`10${charBits.substr(9, 6)}`, 2);
          uintArr[3] = parseInt(`10${charBits.substr(15)}`, 2);
        }

        charArray = [
          ...charArray,
          ...uintArr,
        ];
      }

      return new Uint8Array(charArray);
    }

    function test_encode_utf8_str(str) {
      const a = encode_utf8_str(str);
      console.log('编码后：', a);

      let aa = new TextEncoder();
      console.log('正确的为：', aa.encode(str));
    }
