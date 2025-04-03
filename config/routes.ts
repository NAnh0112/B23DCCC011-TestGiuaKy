﻿export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/manage-subject',
		name: 'Subject Management',
		component: '@/pages/Subject Management',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/game', // Đường dẫn trên URL
		name: 'Game', // Tên hiển thị trên thanh menu
		component: './Game', // base-web-umi/pages/Game/index.tsx
		icon: 'SmileOutlined', // Icon
	},
	{
		path: '/ordersPage', 
		name: 'OrdersPage', 
		icon: 'FileTextOutlined', 
		routes: [
			{
				path: '/ordersPage',
				name: 'Quản lý đơn hàng',
				component: './GiuaKy/OrdersPage',
			},
			{
				path: '/ordersPage/customers',
				name: 'Quản lý khách hàng',
				component: './GiuaKy/Customers',
			},
			{
				path: '/ordersPage/products',
				name: 'Quản lý sản phẩm',
				component: './GiuaKy/Products',
			},
		]
	},

	{
		path: '/manage-question',
		name: 'Question Management',
		icon: 'ArrowsAltOutlined',
		routes: [
			{
				path: '/manage-question/knowledge',
				name: 'Quản lý khối kiến thức',
				component: '@/pages/Question Management/Knowledge',
			},
			{
				path: '/manage-question/subjects',
				name: 'Quản lý môn học',
				component: '@/pages/Question Management/Subject',
			},
			{
				path: '/manage-question/questions',
				name: 'Quản lý câu hỏi',
				component: '@/pages/Question Management/Question',
			},
			{
				path: '/manage-question/exams',
				name: 'Quản lý đề thi',
				component: '@/pages/Question Management/Exam',
			},
		],
	},
	{
		path: '/datlich',
		name: 'Đặt lịch',
		icon: 'CalendarOutlined',
		routes: [
			{
				path: '/datlich',
				redirect: '/datlich/dashboard',
			},
			{
				path: '/datlich/dashboard',
				name: 'Trang chủ',
				component: './DatLich/index',
			},
			{
				path: '/datlich/staff',
				name: 'Quản lý nhân viên',
				component: './DatLich/StaffManagement',
			},
			{
				path: '/datlich/service',
				name: 'Quản lý dịch vụ',
				component: './DatLich/ServiceManagement',
			},
			{
				path: '/datlich/book',
				name: 'Đặt lịch hẹn',
				component: './DatLich/BookAppointment',
			},
			{
				path: '/datlich/manage',
				name: 'Quản lý lịch hẹn',
				component: './DatLich/ManageAppointments',
			},
			// Add new routes for review features
			{
				path: '/datlich/reviews',
				component: './DatLich/CustomerReviews',
				name: 'Đánh giá dịch vụ',
			},
			{
				path: '/datlich/staff-reviews',
				component: './DatLich/StaffReviews',
				name: 'Thống kê đánh giá',
			},
			{
				path: '/datlich/reports',
				component: './DatLich/Reporting',
				name: 'Thống kê & Báo cáo',
			},
		],
	},
	{
		path: '/diploma',
		name: 'Quản lý văn bằng',
		icon: 'FileProtectOutlined',
		routes: [
			{
				path: '/diploma/diploma-books',
				name: 'Quản lý sổ văn bằng',
				component: '@/pages/DiplomaManagement/DiplomaBook/index',
			},
			{
				path: '/diploma/graduation-decisions',
				name: 'Quyết định tốt nghiệp',
				component: '@/pages/DiplomaManagement/GraduationDecision/index',
			},
			{
				path: '/diploma/field-config',
				name: 'Cấu hình biểu mẫu',
				component: '@/pages/DiplomaManagement/DiplomaFieldConfig/index',
			},
			{
				path: '/diploma/diploma-records',
				name: 'Thông tin văn bằng',
				component: '@/pages/DiplomaManagement/DiplomaRecord/index',
			},
			{
				path: '/diploma/diploma-lookup',
				name: 'Tra cứu văn bằng',
				component: '@/pages/DiplomaManagement/DiplomaLookup/index',
			},
			{
				path: '/diploma/lookup-statistics',
				name: 'Thống kê tra cứu',
				component: '@/pages/DiplomaManagement/LookupStatistics/index',
			},
			
		],
	},
	{
		path: '/rockpaperscissors',
		name: 'RockPaperScissors',
		component: './RockPaperScissors/RockPaperScissors',
		icon: 'CheckSquareOutlined',
	},
	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},

	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},

	// Thêm route công khai cho trang tra cứu
	{
		path: '/public',
		layout: false,
		routes: [
			{
				path: '/public/diploma-lookup',
				name: 'Tra cứu văn bằng',
				component: '@/pages/DiplomaManagement/DiplomaLookup/index',
			},
		],
	},
];
