class AttendanceSystem {
    constructor() {
        // 模拟数据存储
        this.users = [];
        this.checkins = [];
        this.studentCheckins = [];
        this.currentUser = null;
        this.currentCheckin = null;
        this.currentCheckinId = null;
        this.cameraFacingMode = 'environment'; // 默认使用后置摄像头
        
        // 初始化模拟数据
        this.initMockData();
    }
    
    init() {
        // 设置当前日期
        this.setCurrentDate();
        
        // 注册事件监听器
        this.registerEventListeners();
        
        // 检查是否有已登录用户
        this.checkLoggedInUser();
    }
    
    initMockData() {
        // 添加模拟用户数据
        this.users.push({
            username: 'teacher1',
            password: '123456',
            type: 'teacher',
            name: '张老师'
        });
        
        this.users.push({
            username: 'student1',
            password: '123456',
            type: 'student',
            name: '学生A',
            studentId: '2025001'
        });
        
        this.users.push({
            username: 'student2',
            password: '123456',
            type: 'student',
            name: '学生B',
            studentId: '2025002'
        });
        
        this.users.push({
            username: 'student3',
            password: '123456',
            type: 'student',
            name: '学生C',
            studentId: '2025003'
        });
        
        // 添加模拟签到数据
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        this.checkins.push({
            id: 'CI20250608001',
            title: '上午第一节课',
            creator: 'teacher1',
            createTime: yesterday,
            duration: 15,
            students: ['student1', 'student2']
        });
        
        this.checkins.push({
            id: 'CI20250608002',
            title: '下午实验课',
            creator: 'teacher1',
            createTime: yesterday,
            duration: 20,
            students: ['student1']
        });
        
        // 添加模拟学生签到记录
        this.studentCheckins.push({
            checkinId: 'CI20250608001',
            studentId: 'student1',
            checkinTime: new Date(yesterday.getTime() + 10 * 60 * 1000) // 创建后10分钟签到
        });
        
        this.studentCheckins.push({
            checkinId: 'CI20250608001',
            studentId: 'student2',
            checkinTime: new Date(yesterday.getTime() + 5 * 60 * 1000) // 创建后5分钟签到
        });
        
        this.studentCheckins.push({
            checkinId: 'CI20250608002',
            studentId: 'student1',
            checkinTime: new Date(yesterday.getTime() + 15 * 60 * 1000) // 创建后15分钟签到
        });
    }
    
    setCurrentDate() {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        const formattedDate = now.toLocaleDateString('zh-CN', options);
        
        document.getElementById('current-date').textContent = formattedDate;
        document.getElementById('current-date-student').textContent = formattedDate;
    }
    
    registerEventListeners() {
        // 导航链接
        document.getElementById('home-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showWelcomePage();
        });
        
        document.getElementById('home-link-mobile').addEventListener('click', (e) => {
            e.preventDefault();
            this.showWelcomePage();
        });
        
        document.getElementById('login-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginPage();
        });
        
        document.getElementById('login-link-mobile').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginPage();
        });
        
        document.getElementById('register-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterPage();
        });
        
        document.getElementById('register-link-mobile').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterPage();
        });
        
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });
        
        document.getElementById('logout-btn-mobile').addEventListener('click', () => {
            this.logout();
        });
        
        // 移动端菜单
        document.getElementById('mobile-menu-btn').addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu.classList.toggle('hidden');
        });
        
        // 登录页面
        document.getElementById('login-submit').addEventListener('click', () => {
            this.handleLogin();
        });
        
        document.getElementById('to-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterPage();
        });
        
        // 注册页面
        document.getElementById('register-submit').addEventListener('click', () => {
            this.handleRegister();
        });
        
        document.getElementById('to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginPage();
        });
        
        // 欢迎页面
        document.getElementById('teacher-btn').addEventListener('click', () => {
            if (this.currentUser && this.currentUser.type === 'teacher') {
                this.showTeacherDashboard();
            } else {
                this.showLoginPage();
            }
        });
        
        document.getElementById('student-btn').addEventListener('click', () => {
            if (this.currentUser && this.currentUser.type === 'student') {
                this.showStudentDashboard();
            } else {
                this.showLoginPage();
            }
        });
        
        // 教师控制面板
        document.getElementById('create-checkin').addEventListener('click', () => {
            this.createCheckin();
        });
        
        document.getElementById('stop-checkin').addEventListener('click', () => {
            this.stopCheckin();
        });
        
        // 学生控制面板
        document.getElementById('start-scan').addEventListener('click', () => {
            this.startScan();
        });
        
        document.getElementById('close-scan-modal').addEventListener('click', () => {
            this.closeScanModal();
        });
        
        document.getElementById('cancel-scan').addEventListener('click', () => {
            this.closeScanModal();
        });
        
        document.getElementById('switch-camera').addEventListener('click', () => {
            this.switchCamera();
        });
        
        // 模态框
        document.getElementById('close-success-modal').addEventListener('click', () => {
            document.getElementById('scan-result-modal').classList.add('hidden');
            if (this.currentUser.type === 'student') {
                this.updateStudentHistoryTable();
            }
        });
        
        document.getElementById('close-error-modal').addEventListener('click', () => {
            document.getElementById('scan-result-modal').classList.add('hidden');
        });
        
        // 签到详情页面
        document.getElementById('back-to-dashboard').addEventListener('click', () => {
            this.showTeacherDashboard();
        });
        
        document.getElementById('refresh-list').addEventListener('click', () => {
            this.loadCheckinDetail(this.currentCheckinId);
        });
        
        document.getElementById('export-excel').addEventListener('click', () => {
            this.exportToExcel();
        });
    }
    
    checkLoggedInUser() {
        // 检查本地存储中是否有登录信息
        const savedUser = localStorage.getItem('attendanceSystemUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateNavAfterLogin();
            
            if (this.currentUser.type === 'teacher') {
                this.showTeacherDashboard();
            } else {
                this.showStudentDashboard();
            }
        } else {
            this.showWelcomePage();
        }
    }
    
    showWelcomePage() {
        this.hideAllPages();
        document.getElementById('welcome-page').classList.remove('hidden');
    }
    
    showLoginPage() {
        this.hideAllPages();
        document.getElementById('login-page').classList.remove('hidden');
    }
    
    showRegisterPage() {
        this.hideAllPages();
        document.getElementById('register-page').classList.remove('hidden');
    }
    
    showTeacherDashboard() {
        this.hideAllPages();
        document.getElementById('teacher-dashboard').classList.remove('hidden');
        
        // 设置教师名称
        document.getElementById('teacher-name').textContent = `欢迎回来，${this.currentUser.name}`;
        
        // 更新签到历史
        this.updateHistoryTable();
        
        // 检查是否有正在进行的签到
        this.checkActiveCheckin();
    }
    
    showStudentDashboard() {
        this.hideAllPages();
        document.getElementById('student-dashboard').classList.remove('hidden');
        
        // 设置学生名称
        document.getElementById('student-name').textContent = `欢迎回来，${this.currentUser.name}`;
        
        // 更新学生签到历史
        this.updateStudentHistoryTable();
    }
    
    showCheckinDetail(checkinId) {
        this.hideAllPages();
        document.getElementById('checkin-detail').classList.remove('hidden');
        
        this.currentCheckinId = checkinId;
        this.loadCheckinDetail(checkinId);
    }
    
    loadCheckinDetail(checkinId) {
        const checkin = this.checkins.find(c => c.id === checkinId);
        if (!checkin) {
            alert('签到记录不存在');
            this.showTeacherDashboard();
            return;
        }
        
        // 设置标题
        document.getElementById('detail-title').textContent = `签到详情: ${checkin.title}`;
        document.getElementById('detail-checkin-title').textContent = checkin.title;
        
        // 设置创建时间
        const createTime = new Date(checkin.createTime);
        document.getElementById('detail-create-time').textContent = createTime.toLocaleString('zh-CN');
        
        // 设置持续时间
        document.getElementById('detail-duration').textContent = `${checkin.duration} 分钟`;
        
        // 获取签到学生
        const checkinStudents = checkin.students || [];
        
        // 获取所有学生
        const allStudents = this.users.filter(u => u.type === 'student');
        
        // 设置统计信息
        document.getElementById('total-students').textContent = allStudents.length;
        document.getElementById('checked-in').textContent = checkinStudents.length;
        document.getElementById('not-checked').textContent = allStudents.length - checkinStudents.length;
        
        // 计算签到率
        const rate = allStudents.length > 0 ? (checkinStudents.length / allStudents.length * 100).toFixed(1) : 0;
        document.getElementById('checkin-rate').textContent = `${rate}%`;
        
        // 填充学生列表
        const tableBody = document.getElementById('student-list-body');
        tableBody.innerHTML = '';
        
        if (allStudents.length === 0) {
            document.getElementById('no-students').classList.remove('hidden');
            return;
        }
        
        document.getElementById('no-students').classList.add('hidden');
        
        allStudents.forEach((student, index) => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors duration-200';
            
            const isChecked = checkinStudents.includes(student.username);
            const checkinTime = isChecked 
                ? this.studentCheckins.find(s => s.checkinId === checkinId && s.studentId === student.username)?.checkinTime
                : null;
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${index + 1}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${student.name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${student.studentId}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${checkinTime ? new Date(checkinTime).toLocaleString('zh-CN') : '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isChecked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${isChecked ? '已签到' : '未签到'}
                    </span>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    hideAllPages() {
        const pages = ['welcome-page', 'login-page', 'register-page', 'teacher-dashboard', 'student-dashboard', 'checkin-detail'];
        pages.forEach(page => {
            document.getElementById(page).classList.add('hidden');
        });
    }
    
    handleLogin() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
            alert('请输入用户名和密码');
            return;
        }
        
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (!user) {
            alert('用户名或密码错误');
            return;
        }
        
        this.currentUser = user;
        localStorage.setItem('attendanceSystemUser', JSON.stringify(user));
        
        this.updateNavAfterLogin();
        
        if (user.type === 'teacher') {
            this.showTeacherDashboard();
        } else {
            this.showStudentDashboard();
        }
    }
    
    handleRegister() {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const isTeacher = document.getElementById('teacher-type').checked;
        
        if (!username || !password) {
            alert('请输入用户名和密码');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }
        
        if (this.users.some(u => u.username === username)) {
            alert('用户名已存在');
            return;
        }
        
        // 创建新用户
        const newUser = {
            username,
            password,
            type: isTeacher ? 'teacher' : 'student',
            name: isTeacher ? `教师${username.slice(-2)}` : `学生${username.slice(-2)}`,
            studentId: isTeacher ? null : `2025${Math.floor(1000 + Math.random() * 9000)}`
        };
        
        this.users.push(newUser);
        
        alert('注册成功，请登录');
        this.showLoginPage();
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('attendanceSystemUser');
        this.updateNavAfterLogin();
        this.showWelcomePage();
    }
    
    updateNavAfterLogin() {
        const loginLinks = ['login-link', 'login-link-mobile', 'register-link', 'register-link-mobile'];
        const logoutButtons = ['logout-btn', 'logout-btn-mobile'];
        
        if (this.currentUser) {
            // 隐藏登录/注册链接，显示退出按钮
            loginLinks.forEach(link => {
                document.getElementById(link).classList.add('hidden');
            });
            
            logoutButtons.forEach(button => {
                document.getElementById(button).classList.remove('hidden');
            });
        } else {
            // 显示登录/注册链接，隐藏退出按钮
            loginLinks.forEach(link => {
                document.getElementById(link).classList.remove('hidden');
            });
            
            logoutButtons.forEach(button => {
                document.getElementById(button).classList.add('hidden');
            });
        }
    }
    
    createCheckin() {
        const title = document.getElementById('checkin-title').value;
        const duration = parseInt(document.getElementById('checkin-duration').value) || 15;
        
        if (!title) {
            alert('请输入签到标题');
            return;
        }
        
        // 生成唯一ID
        const id = `CI${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${Math.floor(100 + Math.random() * 900)}`;
        
        
        const newCheckin = {
            id,
            title,
            creator: this.currentUser.username,
            createTime: new Date(),
            duration,
            students: []
        };

        this.currentCheckin = newCheckin;
        this.checkins.push(newCheckin);
        
        // 显示二维码
        this.generateQRCode(id);
        
        // 更新UI
        document.getElementById('no-current-checkin').classList.add('hidden');
        document.getElementById('current-checkin').classList.remove('hidden');
        document.getElementById('checkin-id').textContent = id;
        
        // 开始倒计时
        this.startCountdown(duration);

        // 模拟异步校验（如检查标题是否重复）
        return new Promise((resolve, reject) => {
        setTimeout(() => {
            const isTitleDuplicate = this.checkins.some(c => c.title === title);
            if (isTitleDuplicate) {
                alert('签到标题已存在');
                reject();
            } else {
                // 生成 newCheckin 并 push
                this.checkins.push(newCheckin);
                resolve();
            }
        }, 1000);
        });
        
        }
    
    generateQRCode(data) {
    const qrCodeElement = document.getElementById('qr-code');
    
    if (!qrCodeElement) {
        console.error('QR code container not found');
        alert('系统错误：找不到二维码容器');
        return;
    }
    
    try {
        const qrData = JSON.stringify({
            type: 'checkin',
            id: data,
            timestamp: new Date().getTime()
        });
        
        console.log('生成二维码数据:', qrData);
        
        // 清除现有二维码
        qrCodeElement.innerHTML = '';
        
        // 生成新二维码
        new QRCode(qrCodeElement, {
            text: qrData,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (error) {
        console.error('生成二维码失败:', error);
        alert('生成二维码失败，请确保网络连接正常');
    }
}
    
    startCountdown(minutes) {
        let totalSeconds = minutes * 60;
        const timeLeftElement = document.getElementById('time-left');
        
        const countdown = setInterval(() => {
            totalSeconds--;
            
            if (totalSeconds <= 0) {
                clearInterval(countdown);
                this.stopCheckin();
                return;
            }
            
            const mins = Math.floor(totalSeconds / 60);
            const secs = totalSeconds % 60;
            
            timeLeftElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    stopCheckin() {
        this.currentCheckin = null;
        document.getElementById('current-checkin').classList.add('hidden');
        document.getElementById('no-current-checkin').classList.remove('hidden');
        alert('签到已结束');
        
        // 更新历史表格
        this.updateHistoryTable();
    }
    
    updateHistoryTable() {
        const tableBody = document.getElementById('history-table-body');
        tableBody.innerHTML = '';
        
        // 获取当前教师的所有签到记录
        const teacherCheckins = this.checkins.filter(c => c.creator === this.currentUser.username);
        
        if (teacherCheckins.length === 0) {
            document.getElementById('no-history').classList.remove('hidden');
            return;
        }
        
        document.getElementById('no-history').classList.add('hidden');
        
        // 按创建时间排序，最新的在前
        teacherCheckins.sort((a, b) => b.createTime - a.createTime);
        
        teacherCheckins.forEach(checkin => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors duration-200';
            
            const createTime = new Date(checkin.createTime);
            const studentsCount = checkin.students ? checkin.students.length : 0;
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${checkin.title}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${createTime.toLocaleString('zh-CN')}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${checkin.duration} 分钟</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${studentsCount}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-primary hover:text-primary/80 view-detail-btn" data-id="${checkin.id}">查看详情</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // 添加查看详情按钮事件
        document.querySelectorAll('.view-detail-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const checkinId = btn.getAttribute('data-id');
                this.showCheckinDetail(checkinId);
            });
        });
    }
    
    updateStudentHistoryTable() {
        const tableBody = document.getElementById('student-history-body');
        tableBody.innerHTML = '';
        
        // 获取当前学生的所有签到记录
        const studentCheckins = this.studentCheckins.filter(s => s.studentId === this.currentUser.username);
        
        if (studentCheckins.length === 0) {
            document.getElementById('no-student-history').classList.remove('hidden');
            return;
        }
        
        document.getElementById('no-student-history').classList.add('hidden');
        
        // 按签到时间排序，最新的在前
        studentCheckins.sort((a, b) => b.checkinTime - a.checkinTime);
        
        studentCheckins.forEach(checkin => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors duration-200';
            
            // 查找对应的签到信息
            const checkinInfo = this.checkins.find(c => c.id === checkin.checkinId);
            if (!checkinInfo) return;
            
            const createTime = new Date(checkinInfo.createTime);
            const checkinTime = new Date(checkin.checkinTime);
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${checkinInfo.title}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${createTime.toLocaleString('zh-CN')}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${checkinTime.toLocaleString('zh-CN')}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        已签到
                    </span>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    startScan() {
        // 显示扫描模态框
        document.getElementById('scan-modal').classList.remove('hidden');
        
        // 获取摄像头
        const video = document.getElementById('scan-video');
        
        // 停止任何现有的流
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        
        // 启动摄像头
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: this.cameraFacingMode }
        })
        .then(stream => {
            video.srcObject = stream;
            video.play();
            
            // 开始模拟扫描（实际应用中应使用二维码扫描库）
            this.startMockScan();
        })
        .catch(err => {
            console.error("摄像头访问失败:", err);
            alert("无法访问摄像头，请确保您已授予摄像头权限");
            this.closeScanModal();
        });
    }
    
    startMockScan() {
        // 模拟扫描过程，实际应用中应使用专门的二维码扫描库
        setTimeout(() => {
            // 模拟成功扫描到一个二维码
            this.simulateQRCodeDetection();
        }, 3000);
    }
    
    simulateQRCodeDetection() {
        // 随机决定是否成功扫描
        const isSuccess = Math.random() > 0.3;

         if (isSuccess) {
        // 关键逻辑：找活跃签到（未过期且存在的）
        const activeCheckin = this.checkins.find(c => {
            const createTime = new Date(c.createTime);
            const expireTime = new Date(createTime.getTime() + c.duration * 60 * 1000);
            return expireTime > new Date(); 
        });
        // 后续判断学生是否签到...
        }
        
        if (isSuccess) {
            // 获取当前活跃的签到（如果有）
            const activeCheckin = this.checkins.find(c => {
                const createTime = new Date(c.createTime);
                const expireTime = new Date(createTime.getTime() + c.duration * 60 * 1000);
                return expireTime > new Date();
            });
            
            if (activeCheckin) {
                // 检查学生是否已经签到
                const hasCheckedIn = activeCheckin.students.includes(this.currentUser.username);
                
                if (hasCheckedIn) {
                    // 已签到
                    this.showScanResult(false, "你已经完成了此次签到");
                } else {
                    // 未签到，记录签到
                    activeCheckin.students.push(this.currentUser.username);
                    
                    // 添加学生签到记录
                    this.studentCheckins.push({
                        checkinId: activeCheckin.id,
                        studentId: this.currentUser.username,
                        checkinTime: new Date()
                    });
                    
                    // 显示成功消息
                    this.showScanResult(true, `签到成功 - ${activeCheckin.title}`);
                }
            } else {
                // 没有活跃的签到
                this.showScanResult(false, "没有找到有效的签到活动");
            }
        } else {
            // 扫描失败
            this.showScanResult(false, "扫描失败，请重试");
        }
    }
    
    showScanResult(isSuccess, message) {
        // 隐藏扫描模态框
        this.closeScanModal();
        
        // 显示结果模态框
        const resultModal = document.getElementById('scan-result-modal');
        const successResult = document.getElementById('success-result');
        const errorResult = document.getElementById('error-result');
        const loadingResult = document.getElementById('loading-result');
        
        // 先显示加载状态
        resultModal.classList.remove('hidden');
        successResult.classList.add('hidden');
        errorResult.classList.add('hidden');
        loadingResult.classList.remove('hidden');
        
        // 模拟处理延迟
        setTimeout(() => {
            loadingResult.classList.add('hidden');
            
            if (isSuccess) {
                successResult.classList.remove('hidden');
                document.getElementById('checkin-success-info').textContent = message;
            } else {
                errorResult.classList.remove('hidden');
                document.getElementById('error-message').textContent = message;
            }
        }, 1000);
    }
    
    closeScanModal() {
        const video = document.getElementById('scan-video');
        
        // 停止摄像头流
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
        
        // 隐藏模态框
        document.getElementById('scan-modal').classList.add('hidden');
    }
    
    switchCamera() {
        // 切换摄像头模式
        this.cameraFacingMode = this.cameraFacingMode === 'environment' ? 'user' : 'environment';
        
        // 重新启动摄像头
        const video = document.getElementById('scan-video');
        
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: this.cameraFacingMode }
        })
        .then(stream => {
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.error("切换摄像头失败:", err);
            alert("切换摄像头失败，请确保您有多个摄像头设备");
        });
    }
    
    checkActiveCheckin() {
        // 检查是否有当前教师的活跃签到
        const activeCheckin = this.checkins.find(c => {
            const createTime = new Date(c.createTime);
            const expireTime = new Date(createTime.getTime() + c.duration * 60 * 1000);
            return c.creator === this.currentUser.username && expireTime > new Date();
        });
        
        if (activeCheckin) {
            this.currentCheckin = activeCheckin;
            document.getElementById('no-current-checkin').classList.add('hidden');
            document.getElementById('current-checkin').classList.remove('hidden');
            document.getElementById('checkin-id').textContent = activeCheckin.id;
            
            // 生成二维码
            this.generateQRCode(activeCheckin.id);
            
            // 计算剩余时间
            const now = new Date();
            const expireTime = new Date(new Date(activeCheckin.createTime).getTime() + activeCheckin.duration * 60 * 1000);
            const remainingSeconds = Math.floor((expireTime - now) / 1000);
            
            if (remainingSeconds > 0) {
                this.startCountdown(Math.ceil(remainingSeconds / 60));
            } else {
                // 签到已过期但未标记
                this.stopCheckin();
            }
        } else {
            this.currentCheckin = null;
            document.getElementById('current-checkin').classList.add('hidden');
            document.getElementById('no-current-checkin').classList.remove('hidden');
        }
    }
    
    exportToExcel() {
        // 模拟导出Excel功能
        alert('导出Excel功能已触发，实际应用中会生成并下载Excel文件');
    }
}
    