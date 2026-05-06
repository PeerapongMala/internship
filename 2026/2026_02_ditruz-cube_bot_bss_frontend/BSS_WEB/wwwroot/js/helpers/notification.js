
(function (global) {
   
    const state = {
        refCodeBySystem: {}  
    };

    function getRefCode(systemTypeCode) {
        return state.refCodeBySystem[systemTypeCode] || null;
    }

    function clearRefCode(systemTypeCode) {
        delete state.refCodeBySystem[systemTypeCode];
    }

    /**
     * Send OTP
     * @param {object} param
     * @param {number} param.userSendId
     * @param {number} param.userSendDepartmentId
     * @param {number} param.userReceiveId
     * @param {string} param.bssMailSystemTypeCode
     *
     * Example param:
     * {
     *   userSendId: 5,
     *   userSendDepartmentId: 1,
     *   userReceiveId: 10,
     *   bssMailSystemTypeCode: "PREPARE_UNFIT_EDIT"
     * }
     */
    function send(param) {
         
        if (!param?.userSendId || !param?.userSendDepartmentId || !param?.userReceiveId || !param?.bssMailSystemTypeCode) {
            alert('sendOtp: missing required fields');
            return $.Deferred().reject().promise();  
        }

        const dfd = $.Deferred();

        $.requestAjax({
            service: 'api/Notification/SendOtp',
            type: 'POST',
            parameter: param,
            enableLoader: true,
            onSuccess: function (res) {

                if (!res?.is_success) {
                    alert(res?.msg_desc || 'ส่ง OTP ไม่สำเร็จ');
                    return dfd.reject(res);  
                }

                if (!res?.data?.isSuccess) {
                    alert(res?.data?.responseMessage || 'ส่ง OTP ไม่สำเร็จ');
                    return dfd.reject(res);  
                }

                const refCode = res?.data?.refCode;

               
                if (!refCode || String(refCode).trim() === '') {
                    alert('ส่ง OTP สำเร็จ แต่ไม่ได้รับ refCode');
                    return dfd.reject(res); 
                }

                const systemType = param.bssMailSystemTypeCode;
                state.refCodeBySystem[systemType] = refCode;

                
                dfd.resolve(res.data);
            },
            onError: function () {
                alert('ไม่สามารถเชื่อมต่อระบบ OTP ได้');
                dfd.reject();  
            }
        });

        return dfd.promise();
    }

    /**
     * Verify OTP
     * @param {object} param
     * @param {number} param.userSendId
     * @param {number} param.userSendDepartmentId
     * @param {string} param.bssMailSystemTypeCode
     * @param {string|number} param.bssMailRefCode   // OTP ที่ผู้ใช้กรอก
     *
     * Example param:
     * {
     *   userSendId: 5,
     *   userSendDepartmentId: 1,
     *   bssMailSystemTypeCode: "PREPARE_UNFIT_EDIT",
     *   bssMailRefCode: "724304" // otp from user
     * }
     *
     * Note:
     * - bssMailOtpCode (refCode) will be auto-injected from state by systemTypeCode
     */
    function verify(param) {
        const dfd = $.Deferred();
        if (!param?.userSendId || !param?.userSendDepartmentId || !param?.bssMailSystemTypeCode) {
            alert('verifyOtp: missing required fields');
            return $.Deferred().reject().promise();    
        }

        const otpFromUser = param?.bssMailOtpCode;
        if (!otpFromUser) {
            alert('กรุณากรอก OTP');
            return $.Deferred().reject().promise();    
        }

        $.requestAjax({
            service: 'api/Notification/VerifyOtp',
            type: 'POST',
            parameter: {
                userSendId: param.userSendId,
                userSendDepartmentId: param.userSendDepartmentId,
                bssMailSystemTypeCode: param.bssMailSystemTypeCode,
                bssMailOtpCode: String(otpFromUser),
                bssMailRefCode: String(param.bssMailRefCode)
            },
            enableLoader: true,
            onSuccess: function (res) {
                if (!res?.is_success || !res?.data?.isSuccess) {
                    return dfd.reject({
                        message: res?.data?.responseMessage || res?.msg_desc || 'ยืนยัน OTP ไม่สำเร็จ',
                        raw: res
                    });
                }
                dfd.resolve(res.data);
            },
            onError: function () {
                dfd.reject();
            }
        });
        return dfd.promise(); 
        
    }

    /**
     * Map OTP verify error → ข้อความภาษาไทย
     * ใช้กับ .fail(function(err) { ... }) ของ otp.verify()
     *
     * @param {object} err - Error object จาก otp.verify reject
     *   - err.message  = responseMessage จาก BE
     *   - err.raw      = full response { data: { otpExpireIn, isSuccess, responseMessage } }
     * @returns {string} ข้อความ error ภาษาไทย
     *
     * ตัวอย่าง:
     *   otp.verify({ ... }).fail(function(err) {
     *       errEl.textContent = otp.mapError(err);
     *   });
     */
    function mapError(err) {
        // เช็ค otpExpireIn จาก BE response — ถ้า 0 = หมดอายุ
        var data = err && err.raw && err.raw.data;
        if (data && data.otpExpireIn === 0) {
            return 'รหัส OTP หมดอายุ กรุณาขอรหัสใหม่';
        }

        var raw = (err && err.message) || '';
        var rawLower = raw.toLowerCase();

        // OTP หมดอายุ (จาก message text)
        if (rawLower.indexOf('expire') !== -1 || rawLower.indexOf('timeout') !== -1) {
            return 'รหัส OTP หมดอายุ กรุณาขอรหัสใหม่';
        }
        // OTP ผิด / ไม่ตรง (fail, invalid, incorrect หรืออื่นๆ)
        return 'รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง';
    }

    global.otp = { send, verify, getRefCode, clearRefCode, mapError };

})(window);
