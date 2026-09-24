
// notifications.js - Notifications Center
(function(){
var R=React; var h=R.createElement; var icons=window.lucideReact||{};

window.NotificationsPage=function NotificationsPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state; var dispatch=ctx.dispatch;
  var notifs=state.notifications||[];
  var unread=notifs.filter(function(n){return!n.read;}).length;

  function typeIcon(type){
    var m={absence:'UserX',low_stock:'Pill','low-stock':'Pill','out-of-stock':'AlertTriangle',expiry:'Clock',high_queue:'Users','high-queue':'Users','critical-phc':'AlertOctagon',assignment:'CheckCircle','pending-approval':'Clock',info:'Info',warning:'AlertTriangle',critical:'AlertOctagon'};
    var IC=icons[m[type]||'Bell'];
    return IC?h(IC,{size:16}):null;
  }

  function sevColor(sev){
    if(sev==='critical')return'border-l-red-500 bg-red-50/50';
    if(sev==='warning')return'border-l-orange-400 bg-orange-50/50';
    return'border-l-blue-400 bg-blue-50/30';
  }

  return h('div',{className:'space-y-5 max-w-3xl'},
    h('div',{className:'flex items-center justify-between'},
      h('div',{},h('h1',{className:'text-xl font-bold text-gray-900'},'Notifications'),h('p',{className:'text-gray-500 text-sm'},unread+' unread of '+notifs.length+' total')),
      h('button',{onClick:function(){notifs.forEach(function(n){dispatch({type:'DISMISS_NOTIFICATION',id:n.id});});},
        className:'px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-medium'},'Mark All Read')
    ),
    h('div',{className:'space-y-2'},
      notifs.length===0?h(window.Card,{className:'p-10 text-center'},h('p',{className:'text-gray-400'},'No notifications')):
      notifs.map(function(n){
        return h('div',{key:n.id,
          className:'bg-white border-l-4 rounded-xl p-4 shadow-sm flex items-start gap-4 cursor-pointer transition-all '+(n.read?'border-l-gray-200 opacity-75':sevColor(n.severity)),
          onClick:function(){dispatch({type:'DISMISS_NOTIFICATION',id:n.id});}
        },
          h('div',{className:'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center '+(n.severity==='critical'?'bg-red-100 text-red-600':n.severity==='warning'?'bg-orange-100 text-orange-600':'bg-blue-100 text-blue-600')},
            typeIcon(n.type)
          ),
          h('div',{className:'flex-1 min-w-0'},
            h('div',{className:'flex items-start justify-between gap-2'},
              h('p',{className:'font-semibold text-gray-900 text-sm leading-tight'},n.title),
              h('span',{className:'text-xs text-gray-400 whitespace-nowrap flex-shrink-0'},n.time)
            ),
            h('p',{className:'text-gray-600 text-sm mt-1 leading-relaxed'},n.message),
            h('div',{className:'flex items-center gap-3 mt-2'},
              h(window.Badge,{status:n.severity||'info'},n.severity||'info'),
              !n.read&&h('span',{className:'w-2 h-2 bg-blue-500 rounded-full'})
            )
          )
        );
      })
    )
  );
};

console.log('[SmartPHC] Notifications loaded.');
})();
