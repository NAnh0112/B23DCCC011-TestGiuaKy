export default [
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
		path: '/manage-question',
		name: 'Question Management',
		icon: 'ArrowsAltOutlined',
		routes: [
			{
				path: '/manage-question/knowledge',
				name: 'Quản lý khối kiến thức',
				component: '@/pages/Question Management/Knowledge'
			},
			{
				path: '/manage-question/subjects',
				name: 'Quản lý môn học',
				component: '@/pages/Question Management/Subject'
			},
			{
				path: '/manage-question/questions',
				name: 'Quản lý câu hỏi',
				component: '@/pages/Question Management/Question'
			},
			{
				path: '/manage-question/exams',
				name: 'Quản lý đề thi',
				component: '@/pages/Question Management/Exam'
			}
		]
	},
	{
		path:'/rockpaperscissors',
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
];
