// login.js - Professional Login Page
(function(){
var R=React;var h=R.createElement;
var icons=window.lucideReact||{};

window.LoginPage=function LoginPage(){
  var ctx=R.useContext(window.AppContext);
  var dispatch=ctx.dispatch;
  var roleState=R.useState('ddhs');
  var selectedRole=roleState[0];var setRole=roleState[1];
  var emailState=R.useState('ddhs@coimbatore.gov.in');
  var email=emailState[0];var setEmail=emailState[1];
  var passState=R.useState('Demo@1234');
  var password=passState[0];var setPass=passState[1];
  var showPassState=R.useState(false);
  var showPass=showPassState[0];var setShowPass=showPassState[1];
  var errState=R.useState('');
  var err=errState[0];var setErr=errState[1];
  var loadState=R.useState(false);
  var loading=loadState[0];var setLoading=loadState[1];

  var roles=[
    {id:'ddhs',label:'DDHS Authority',icon:'Building2',email:'ddhs@coimbatore.gov.in',desc:'District Health Officer'},
    {id:'staff',label:'PHC Staff',icon:'Users',email:'staff@phckuniyamuthur.gov.in',desc:'Nurse / Data Entry Operator'},
    {id:'doctor',label:'Doctor',icon:'Stethoscope',email:'dr.arun@phcsinganallur.gov.in',desc:'Medical Officer'},
    {id:'patient',label:'Patient',icon:'User',email:'patient@demo.in',desc:'Registered Patient'},
    {id:'admin',label:'Administrator',icon:'Shield',email:'admin@smartphc.gov.in',desc:'System Administrator'}
  ];

  function selectRole(role){
    setRole(role.id);
    setEmail(role.email);
    setPass('Demo@1234');
    setErr('');
  }

  function doLogin(){
    setErr('');
    setLoading(true);
    setTimeout(function(){
      var user=window.DEMO_USERS.find(function(u){return u.email===email&&u.password===password;});
      if(!user){setErr('Invalid credentials. Use the demo accounts listed below.');setLoading(false);return;}
      dispatch({type:'SET_USER',user:user});
      setLoading(false);
    },800);
  }

  var EyeIcon=icons.Eye;var EyeOffIcon=icons.EyeOff;
  var LockIcon=icons.Lock;var MailIcon=icons.Mail;
  var ShieldIcon=icons.Shield;

  return h('div',{className:'min-h-screen flex'},
    // Left panel
    h('div',{className:'hidden lg:flex w-3/5 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 flex-col justify-between p-12'},
      h('div',{},
        h('div',{className:'flex items-center gap-3 mb-12'},
          h('div',{className:'w-12 h-12 bg-teal-400 rounded-xl flex items-center justify-center text-2xl font-bold text-white'},'+'),
          h('div',{},
            h('h1',{className:'text-2xl font-bold text-white'},'Smart PHC'),
            h('p',{className:'text-teal-200 text-sm'},'AI-Based Healthcare Management')
          )
        ),
        h('h2',{className:'text-4xl font-bold text-white mb-4 leading-tight'},'Centralized PHC\nManagement System'),
        h('p',{className:'text-blue-200 text-lg mb-10 max-w-md'},'AI-Assisted Doctor Recommendation & Dynamic Resource Allocation for Coimbatore District'),
        h('div',{className:'space-y-5'},
          [{icon:'Sparkles',title:'AI Doctor Recommendation',desc:'Intelligent scoring algorithm recommends substitute doctors based on specialization, distance & patient load'},{icon:'LayoutDashboard',title:'Real-Time District Monitoring',desc:'Live overview of all 30 PHCs, doctor attendance, queues and medicine inventory'},{icon:'Shield',title:'Secure & Auditable',desc:'Role-based access control with complete audit trail for all clinical decisions'}].map(function(f){
            var IC=icons[f.icon];
            return h('div',{key:f.title,className:'flex items-start gap-4'},
              h('div',{className:'flex-shrink-0 w-10 h-10 bg-teal-500/30 rounded-lg flex items-center justify-center'},IC&&h(IC,{size:20,className:'text-teal-300'})),
              h('div',{},h('h4',{className:'text-white font-semibold text-sm'},f.title),h('p',{className:'text-blue-300 text-xs mt-0.5'},f.desc))
            );
          })
        )
      ),
      h('div',{},
        h('p',{className:'text-blue-400 text-xs'},'Coimbatore District Health Department · Government of Tamil Nadu · 2026'),
        h('p',{className:'text-blue-500 text-xs mt-1'},'Smart PHC is a decision-support prototype for academic use only.')
      )
    ),
    // Right panel
    h('div',{className:'flex-1 flex flex-col justify-center items-center p-8 bg-gray-50 overflow-y-auto'},
      h('div',{className:'w-full max-w-md'},
        h('div',{className:'text-center mb-8'},
          h('div',{className:'w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'},
            h('span',{className:'text-3xl font-bold text-white'},'+')
          ),
          h('h2',{className:'text-2xl font-bold text-gray-900'},'Welcome Back'),
          h('p',{className:'text-gray-500 text-sm mt-1'},'Sign in to Smart PHC Management System')
        ),
        // Role selector
        h('div',{className:'grid grid-cols-5 gap-2 mb-6'},
          roles.map(function(role){
            var active=selectedRole===role.id;
            var IC=icons[role.icon];
            return h('button',{
              key:role.id,
              onClick:function(){selectRole(role);},
              className:'flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all text-center '+(active?'border-blue-600 bg-blue-50 text-blue-700':'border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:bg-blue-50')
            },
              IC&&h(IC,{size:18}),
              h('span',{className:'text-xs font-medium leading-tight mt-0.5'},role.label)
            );
          })
        ),
        // Form
        h('div',{className:'space-y-4 mb-6'},
          h('div',{},
            h('label',{className:'block text-sm font-medium text-gray-700 mb-1.5'},'Email / User ID'),
            h('div',{className:'relative'},
              MailIcon&&h(MailIcon,{size:16,className:'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'}),
              h('input',{type:'email',value:email,onChange:function(e){setEmail(e.target.value);},className:'w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm',placeholder:'Email address'})
            )
          ),
          h('div',{},
            h('label',{className:'block text-sm font-medium text-gray-700 mb-1.5'},'Password'),
            h('div',{className:'relative'},
              LockIcon&&h(LockIcon,{size:16,className:'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'}),
              h('input',{type:showPass?'text':'password',value:password,onChange:function(e){setPass(e.target.value);},onKeyDown:function(e){if(e.key==='Enter')doLogin();},className:'w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm',placeholder:'Password'}),
              h('button',{type:'button',onClick:function(){setShowPass(!showPass);},className:'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'},
                showPass?(EyeOffIcon&&h(EyeOffIcon,{size:16})):(EyeIcon&&h(EyeIcon,{size:16}))
              )
            )
          )
        ),
        err&&h('div',{className:'mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'},err),
        h('button',{
          onClick:doLogin,disabled:loading,
          className:'w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
        },loading?'Authenticating...':'Sign In to Smart PHC'),
        h('p',{className:'text-center text-sm text-gray-500 mt-4'},h('button',{className:'text-blue-600 hover:underline font-medium'},'Forgot Password?')),
        // Demo credentials
        h('div',{className:'mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100'},
          h('div',{className:'flex items-center gap-2 mb-3'},ShieldIcon&&h(ShieldIcon,{size:14,className:'text-blue-600'}),h('p',{className:'text-xs font-semibold text-blue-700 uppercase tracking-wide'},'Demo Credentials (Password: Demo@1234)')),
          h('div',{className:'space-y-1.5'},
            roles.map(function(role){
              return h('button',{
                key:role.id,
                onClick:function(){selectRole(role);},
                className:'w-full text-left px-3 py-2 bg-white rounded-lg border border-blue-100 hover:border-blue-300 transition-colors'
              },
                h('div',{className:'flex items-center justify-between'},
                  h('span',{className:'text-xs font-medium text-blue-700'},role.label),
                  h('span',{className:'text-xs text-gray-500 font-mono'},role.email.split('@')[0])
                )
              );
            })
          )
        ),
        h('div',{className:'flex items-center justify-center gap-1.5 mt-5'},
          h('span',{className:'w-2 h-2 rounded-full bg-green-500'}),
          h('span',{className:'text-xs text-gray-400'},'Secure connection · TLS 1.3 · Role-based access control')
        )
      )
    )
  );
};

console.log('[SmartPHC] Login page loaded.');
})();
