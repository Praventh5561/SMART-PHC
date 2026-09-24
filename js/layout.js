// layout.js - Sidebar, TopNav, DashboardLayout
(function(){
var R=React;var h=R.createElement;
var icons=window.lucideReact||{};
var I=function(name,sz){var C=icons[name];return C?h(C,{size:sz||18}):null;};

var SIDEBARS={
  ddhs:[
    {label:'Dashboard',page:'ddhs/dashboard',icon:'LayoutDashboard'},
    {label:'PHC Management',page:'ddhs/phcs',icon:'Building2'},
    {label:'Doctor Attendance',page:'ddhs/attendance',icon:'ClipboardCheck'},
    {label:'AI Recommendations',page:'ddhs/ai-recommendations',icon:'Sparkles'},
    {label:'Live Queue',page:'ddhs/live-queue',icon:'Users'},
    {label:'Medicine Inventory',page:'ddhs/medicine',icon:'Pill'},
    {label:'Patient Registration',page:'ddhs/patient-registration',icon:'UserPlus'},
    {label:'Reports',page:'ddhs/reports',icon:'BarChart3'},
    {label:'Audit Logs',page:'ddhs/audit',icon:'FileText'},
    {label:'Notifications',page:'ddhs/notifications',icon:'Bell'},
    {label:'Settings',page:'ddhs/settings',icon:'Settings'}
  ],
  doctor:[
    {label:'Dashboard',page:'doctor/dashboard',icon:'LayoutDashboard'},
    {label:'My Attendance',page:'doctor/attendance',icon:'ClipboardCheck'},
    {label:'Patient Queue',page:'doctor/queue',icon:'Users'},
    {label:'Patient History',page:'doctor/history',icon:'History'},
    {label:'Medicine Availability',page:'doctor/medicine',icon:'Pill'},
    {label:'My Assignments',page:'doctor/assignments',icon:'ArrowRightLeft'},
    {label:'Profile',page:'doctor/profile',icon:'User'}
  ],
  staff:[
    {label:'Dashboard',page:'staff/dashboard',icon:'LayoutDashboard'},
    {label:'Patient Registration',page:'staff/registration',icon:'UserPlus'},
    {label:'QR Scanner',page:'staff/scanner',icon:'QrCode'},
    {label:'Queue Management',page:'staff/queue',icon:'Users'},
    {label:'Medicine Inventory',page:'staff/medicine',icon:'Pill'},
    {label:'Doctor Attendance',page:'staff/attendance',icon:'ClipboardCheck'},
    {label:'Reports',page:'staff/reports',icon:'BarChart3'}
  ],
  patient:[
    {label:'Dashboard',page:'patient/dashboard',icon:'LayoutDashboard'},
    {label:'My QR Code',page:'patient/qr',icon:'QrCode'},
    {label:'My Token',page:'patient/token',icon:'Ticket'},
    {label:'Visit History',page:'patient/history',icon:'History'},
    {label:'Profile',page:'patient/profile',icon:'User'}
  ],
  admin:[
    {label:'Dashboard',page:'admin/dashboard',icon:'LayoutDashboard'},
    {label:'Manage Users',page:'admin/users',icon:'Users'},
    {label:'PHC Management',page:'admin/phcs',icon:'Building2'},
    {label:'Doctor Registry',page:'admin/doctors',icon:'Stethoscope'},
    {label:'Configuration',page:'admin/config',icon:'Settings'},
    {label:'AI Weights',page:'admin/ai-weights',icon:'Sparkles'},
    {label:'Audit Logs',page:'admin/audit',icon:'FileText'},
    {label:'System Settings',page:'admin/settings',icon:'Shield'}
  ]
};

var ROLE_LABELS={ddhs:'DDHS Authority',staff:'PHC Staff',doctor:'Doctor',patient:'Patient',admin:'System Admin'};

// ── Sidebar ───────────────────────────────────────────────────
window.Sidebar=function Sidebar(props){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state;var dispatch=ctx.dispatch;
  var role=state.currentUser?state.currentUser.role:'ddhs';
  var items=SIDEBARS[role]||SIDEBARS.ddhs;
  var page=state.currentPage;

  return h('aside',{className:'flex flex-col h-full bg-blue-900 text-white w-64 flex-shrink-0'},
    // Logo
    h('div',{className:'p-5 border-b border-blue-800'},
      h('div',{className:'flex items-center gap-3 mb-3'},
        h('div',{className:'w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-lg text-white'},'+'),
        h('div',{},
          h('h1',{className:'font-bold text-base leading-tight'},'Smart PHC'),
          h('p',{className:'text-blue-300 text-xs'},'Healthcare Management')
        )
      ),
      h('div',{className:'flex items-center gap-2 px-2 py-1 bg-blue-800 rounded-lg'},
        h('div',{className:'w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-xs font-bold'},state.currentUser?state.currentUser.avatar:'?'),
        h('div',{className:'flex-1 min-w-0'},
          h('p',{className:'text-xs font-medium truncate'},state.currentUser?state.currentUser.name:''),
          h('p',{className:'text-xs text-blue-300 truncate'},ROLE_LABELS[role]||role)
        )
      )
    ),
    // Navigation
    h('nav',{className:'flex-1 overflow-y-auto py-4 px-3 space-y-1'},
      items.map(function(item){
        var active=page===item.page;
        var IconC=icons[item.icon];
        return h('button',{
          key:item.page,
          onClick:function(){dispatch({type:'NAVIGATE',page:item.page});if(props.onClose)props.onClose();},
          className:'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all '+(active?'bg-teal-600 text-white shadow-sm':'text-blue-200 hover:bg-blue-800 hover:text-white')
        },
          IconC&&h(IconC,{size:17}),
          item.label
        );
      })
    ),
    // Footer
    h('div',{className:'p-4 border-t border-blue-800'},
      h('button',{
        onClick:function(){dispatch({type:'LOGOUT'});},
        className:'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-blue-300 hover:bg-blue-800 hover:text-white transition-all'
      },I('LogOut',16),'Sign Out'),
      h('p',{className:'text-center text-blue-400 text-xs mt-3'},'Coimbatore District')
    )
  );
};

// ── TopNav ────────────────────────────────────────────────────
window.TopNav=function TopNav(props){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state;var dispatch=ctx.dispatch;
  var unread=(state.notifications||[]).filter(function(n){return!n.read;}).length;
  var Bell=icons.Bell;var Menu=icons.Menu;

  return h('header',{className:'bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between flex-shrink-0'},
    h('div',{className:'flex items-center gap-3'},
      h('button',{className:'lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500',onClick:props.onMenuToggle},I('Menu',20)),
      h('div',{},
        h('h2',{className:'font-semibold text-gray-900 text-base leading-tight'},props.pageTitle||'Dashboard'),
        h('p',{className:'text-gray-400 text-xs'},'Smart PHC · Coimbatore District')
      )
    ),
    h('div',{className:'flex items-center gap-3'},
      h(window.OfflineIndicator,{isOnline:state.isOnline}),
      Bell&&h('button',{
        onClick:function(){dispatch({type:'NAVIGATE',page:(state.currentUser?state.currentUser.role:'ddhs')+'/notifications'});},
        className:'relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors'
      },
        h(Bell,{size:20}),
        unread>0&&h('span',{className:'absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold'},unread>9?'9+':unread)
      ),
      h('div',{className:'flex items-center gap-2 pl-3 border-l border-gray-200'},
        h('div',{className:'w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold'},state.currentUser?state.currentUser.avatar:'?'),
        h('div',{className:'hidden sm:block'},
          h('p',{className:'text-sm font-medium text-gray-900 leading-tight'},state.currentUser?state.currentUser.name:''),
          h('p',{className:'text-xs text-gray-400'},{ddhs:'DDHS Authority',staff:'PHC Staff',doctor:'Doctor',patient:'Patient',admin:'Administrator'}[state.currentUser?state.currentUser.role:'']||'')
        )
      )
    )
  );
};

// ── DashboardLayout ───────────────────────────────────────────
window.DashboardLayout=function DashboardLayout(props){
  var sidebarOpen=R.useState(false);
  var open=sidebarOpen[0];var setOpen=sidebarOpen[1];
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state;

  return h('div',{className:'flex h-screen overflow-hidden bg-gray-50'},
    // Desktop sidebar
    h('div',{className:'hidden lg:flex lg:flex-shrink-0'},
      h(window.Sidebar,{onClose:function(){setOpen(false);}})),
    // Mobile sidebar overlay
    open&&h('div',{className:'fixed inset-0 z-40 lg:hidden'},
      h('div',{className:'fixed inset-0 bg-gray-600 bg-opacity-75',onClick:function(){setOpen(false);}}),
      h('div',{className:'relative flex w-64 h-full bg-blue-900'},
        h(window.Sidebar,{onClose:function(){setOpen(false);}})
      )
    ),
    // Main content
    h('div',{className:'flex flex-col flex-1 min-w-0 overflow-hidden'},
      h(window.TopNav,{pageTitle:props.pageTitle,onMenuToggle:function(){setOpen(function(v){return!v;});}}),
      h('main',{className:'flex-1 overflow-y-auto p-4 md:p-6'},props.children),
      // Footer disclaimer
      h('footer',{className:'bg-white border-t border-gray-100 px-6 py-2 text-center'},
        h('p',{className:'text-xs text-gray-400'},'Smart PHC is a decision-support prototype. Doctor recommendations are advisory and require authorized DDHS approval. Not intended for diagnosis or treatment.')
      )
    ),
    // Toast
    h(window.Toast,{message:state.toastMsg})
  );
};

console.log('[SmartPHC] Layout loaded.');
})();
