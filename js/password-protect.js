// 密码保护
(function() {
    const password = '123456'; // 设置密码
    const storageKey = 'blog_password';
    const contentKey = 'blog_content';
    
    // 检查是否已经输入过密码
    if (localStorage.getItem(storageKey) === password) {
        return;
    }
    
    // 保存原始内容
    if (!localStorage.getItem(contentKey)) {
        localStorage.setItem(contentKey, document.body.innerHTML);
    }
    
    // 创建密码输入界面
    const passwordHtml = `
        <div id="password-protect" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
        ">
            <h2 style="margin-bottom: 20px;">这是一个加密网站</h2>
            <div style="
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                text-align: center;
            ">
                <p style="margin-bottom: 15px;">请输入密码访问网站</p>
                <input type="password" id="password-input" style="
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    width: 200px;
                ">
                <button onclick="checkPassword()" style="
                    padding: 10px 20px;
                    background: #10b981;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">确认</button>
                <p id="error-message" style="
                    color: red;
                    margin-top: 10px;
                    display: none;
                ">密码错误，请重试</p>
            </div>
        </div>
    `;
    
    // 添加密码输入界面
    document.body.innerHTML = passwordHtml;
    
    // 检查密码函数
    window.checkPassword = function() {
        const input = document.getElementById('password-input');
        const errorMessage = document.getElementById('error-message');
        
        if (input.value === password) {
            localStorage.setItem(storageKey, password);
            document.body.innerHTML = localStorage.getItem(contentKey);
        } else {
            errorMessage.style.display = 'block';
            input.value = '';
        }
    };
    
    // 添加回车键支持
    document.getElementById('password-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
})(); 