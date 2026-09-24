
// queue.js - Live Queue Management + Reception Display
(function(){
var R=React; var h=R.createElement; var icons=window.lucideReact||{};

window.QueueManagementPage=function QueueManagementPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state; var dispatch=ctx.dispatch;
  var role=state.currentUser?state.currentUser.role:'staff';
  var userPhcId=state.currentUser&&state.currentUser.phcId;
  var selPhcState=R.useState(userPhcId||'PHC001');
  var selPhc=selPhcState[0]; var setSelPhc=selPhcState[1];
  var showReceptionState=R.useState(false);
  var showReception=showReceptionState[0]; var setShowReception=showReceptionState[1];

  var phcObj=state.phcs.find(function(p){return p.id===selPhc;})||state.phcs[0]||{};
  var queue=state.queues[selPhc]||{currentToken:0,serving:0,tokens:[]};
  var phcDoctors=state.doctors.filter(function(d){return d.currentPhcId===selPhc;});
  var wc=window.waitColor(phcObj.avgWaitingTime||0);
  var noDocs=phcDoctors.filter(function(d){return d.status==='available';}).length===0;

  var Tv=icons.Tv2||icons.Monitor; var Nxt=icons.ChevronRight; var CkC=icons.CheckCircle;
  var Pu=icons.PauseCircle; var Us=icons.Users; var Clk=icons.Clock; var AT=icons.AlertTriangle;

  if(showReception){
    return h('div',{className:'fixed inset-0 bg-blue-900 flex flex-col items-center justify-center z-50'},
      h('button',{onClick:function(){setShowReception(false);},className:'absolute top-6 right-6 text-white/50 hover:text-white text-sm'},'✖ Close Reception View'),
      h('div',{className:'text-center'},
        h('p',{className:'text-blue-300 text-xl mb-2 font-medium uppercase tracking-widest'},phcObj.name||''),
        h('p',{className:'text-blue-400 text-base mb-8'},'Now Serving'),
        h('div',{className:'token-display mb-6'},'A'+String(queue.serving||0).padStart(3,'0')),
        h('p',{className:'text-white/50 text-lg mb-8'},'Please proceed to the doctor\'s cabin'),
        h('div',{className:'flex gap-4 justify-center mb-12'},
          queue.tokens.slice(0,4).map(function(t){
            return h('div',{key:t,className:'w-16 h-16 bg-blue-800/60 rounded-xl flex items-center justify-center text-blue-200 text-lg font-bold'},'A'+String(t).padStart(3,'0'));
          })
        ),
        h('div',{className:'flex gap-6 justify-center text-white/60 text-sm'},
          h('span',{},'Waiting: '+queue.tokens.length),
          h('span',{},'Est. wait: '+phcObj.avgWaitingTime+' min')
        )
      ),
      h('p',{className:'absolute bottom-6 text-blue-500 text-xs'},'Smart PHC · '+new Date().toLocaleTimeString('en-IN'))
    );
  }

  return h('div',{className:'space-y-6'},
    h('div',{className:'flex items-center justify-between flex-wrap gap-3'},
      h('div',{},h('h1',{className:'text-xl font-bold text-gray-900'},'Live Queue Management'),h('p',{className:'text-gray-500 text-sm'},'Real-time patient queue monitoring & control')),
      h('div',{className:'flex gap-2'},
        role!=='patient'&&h('select',{value:selPhc,onChange:function(e){setSelPhc(e.target.value);},className:'px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white'},
          state.phcs.map(function(p){return h('option',{key:p.id,value:p.id},p.name);})),
        Tv&&h('button',{onClick:function(){setShowReception(true);},className:'flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700'},h(Tv,{size:16}),'Reception View')
      )
    ),
    noDocs&&h('div',{className:'flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl'},
      AT&&h(AT,{size:20,className:'text-red-600 flex-shrink-0'}),
      h('p',{className:'text-red-800 font-semibold'},'No Doctor On Duty at '+phcObj.name+'. Patients cannot be attended.')
    ),
    h('div',{className:'grid lg:grid-cols-3 gap-6'},
      h('div',{className:'lg:col-span-2 space-y-4'},
        h(window.Card,{className:'p-6'},
          h('p',{className:'text-gray-400 text-sm font-medium uppercase tracking-wide mb-2'},'Now Serving'),
          h('div',{className:'text-center py-6'},
            h('div',{className:'token-display'},'A'+String(queue.serving||0).padStart(3,'0')),
            h('p',{className:'text-gray-400 text-sm mt-2'},phcObj.name||'')
          ),
          h('div',{className:'flex gap-3 mt-4 justify-center'},
            h('button',{
              onClick:function(){dispatch({type:'CALL_NEXT_TOKEN',phcId:selPhc});},
              disabled:queue.tokens.length===0,
              className:'flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
            },Nxt&&h(Nxt,{size:16}),'Call Next'),
            h('button',{className:'flex items-center gap-2 px-4 py-2.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-xl font-medium text-sm transition-colors'},Pu&&h(Pu,{size:16}),'Hold Token'),
            h('button',{className:'flex items-center gap-2 px-4 py-2.5 bg-green-100 hover:bg-green-200 text-green-800 rounded-xl font-medium text-sm transition-colors'},CkC&&h(CkC,{size:16}),'Complete')
          )
        ),
        queue.tokens.length>0&&h(window.Card,{className:'p-5'},
          h('p',{className:'font-semibold text-gray-700 mb-3'},'Next in Queue'),
          h('div',{className:'flex flex-wrap gap-3'},
            queue.tokens.slice(0,8).map(function(t,i){
              return h('div',{key:t,className:'flex flex-col items-center gap-1 w-16 h-16 '+(i===0?'bg-blue-600 text-white':'bg-gray-100 text-gray-600')+' rounded-xl justify-center font-bold text-lg'},
                'A'+String(t).padStart(3,'0'),
                h('span',{className:'text-xs opacity-70'},i===0?'Next':'')
              );
            })
          )
        )
      ),
      h('div',{className:'space-y-4'},
        h(window.Card,{className:'p-5'},
          h('p',{className:'font-semibold text-gray-700 mb-3'},'Queue Status'),
          h('div',{className:'space-y-3'},
            h('div',{className:'flex items-center justify-between'},h('span',{className:'text-sm text-gray-500'},'Waiting'),h('span',{className:'font-bold text-gray-900 text-lg'},queue.tokens.length)),
            h('div',{className:'flex items-center justify-between'},h('span',{className:'text-sm text-gray-500'},'Est. Wait'),
              h('span',{className:'font-bold text-lg '+wc.text},phcObj.avgWaitingTime+' min')),
            h('div',{className:'flex items-center justify-between'},h('span',{className:'text-sm text-gray-500'},'Status'),h(window.Badge,{status:phcObj.status||'normal'},(phcObj.status||'normal').charAt(0).toUpperCase()+(phcObj.status||'normal').slice(1)))
          )
        ),
        h(window.Card,{className:'p-5'},
          h('p',{className:'font-semibold text-gray-700 mb-3'},'Doctors'),
          h('div',{className:'space-y-2'},
            phcDoctors.length===0?h('p',{className:'text-gray-400 text-sm'},'No doctors assigned'):
            phcDoctors.map(function(d){
              return h('div',{key:d.id,className:'flex items-center justify-between p-2.5 bg-gray-50 rounded-lg'},
                h('div',{},h('p',{className:'font-medium text-gray-900 text-sm'},d.name),h('p',{className:'text-xs text-gray-400'},d.specialization)),
                h(window.Badge,{status:d.status},d.status)
              );
            })
          )
        ),
        h(window.Card,{className:'p-5'},
          h('p',{className:'font-semibold text-gray-700 mb-2'},'Today\'s Stats'),
          h('div',{className:'space-y-2 text-sm'},
            h('div',{className:'flex justify-between'},h('span',{className:'text-gray-500'},'Tokens Issued'),h('span',{className:'font-semibold'},phcObj.lastToken||0)),
            h('div',{className:'flex justify-between'},h('span',{className:'text-gray-500'},'Served'),h('span',{className:'font-semibold text-green-600'},phcObj.currentToken||0)),
            h('div',{className:'flex justify-between'},h('span',{className:'text-gray-500'},'Remaining'),h('span',{className:'font-semibold text-orange-600'},queue.tokens.length))
          )
        )
      )
    )
  );
};

window.LiveQueueDisplay=window.QueueManagementPage;
console.log('[SmartPHC] Queue loaded.');
})();
