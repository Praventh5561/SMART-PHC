// utils.js - Shared UI utility components
(function(){
var R=React;
var h=R.createElement;
var icons=window.lucideReact||{};

// ── Badge ──────────────────────────────────────────────────────
window.Badge=function Badge(props){
  var colors={
    available:'bg-green-100 text-green-700 border border-green-200',
    normal:'bg-green-100 text-green-700 border border-green-200',
    absent:'bg-red-100 text-red-700 border border-red-200',
    'on-leave':'bg-yellow-100 text-yellow-700 border border-yellow-200',
    delayed:'bg-orange-100 text-orange-700 border border-orange-200',
    critical:'bg-red-100 text-red-700 border border-red-200',
    moderate:'bg-yellow-100 text-yellow-700 border border-yellow-200',
    'assigned-elsewhere':'bg-purple-100 text-purple-700 border border-purple-200',
    'checked-out':'bg-gray-100 text-gray-600 border border-gray-200',
    'low-stock':'bg-orange-100 text-orange-700 border border-orange-200',
    'out-of-stock':'bg-red-100 text-red-700 border border-red-200',
    'near-expiry':'bg-yellow-100 text-yellow-700 border border-yellow-200',
    expired:'bg-red-100 text-red-700 border border-red-200',
    info:'bg-blue-100 text-blue-700 border border-blue-200',
    warning:'bg-orange-100 text-orange-700 border border-orange-200'
  };
  var cls=colors[props.status]||'bg-gray-100 text-gray-600 border border-gray-200';
  return h('span',{className:'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium '+cls+(props.className?' '+props.className:'')},props.children);
};

// ── Card ──────────────────────────────────────────────────────
window.Card=function Card(props){
  return h('div',{className:'bg-white rounded-xl shadow-sm border border-gray-100 '+(props.className||''),onClick:props.onClick,style:props.style},props.children);
};

// ── KPICard ───────────────────────────────────────────────────
window.KPICard=function KPICard(props){
  var colorMap={
    blue:{bg:'bg-blue-50',icon:'bg-blue-100',text:'text-blue-600',val:'text-blue-700'},
    teal:{bg:'bg-teal-50',icon:'bg-teal-100',text:'text-teal-600',val:'text-teal-700'},
    green:{bg:'bg-green-50',icon:'bg-green-100',text:'text-green-600',val:'text-green-700'},
    red:{bg:'bg-red-50',icon:'bg-red-100',text:'text-red-600',val:'text-red-700'},
    orange:{bg:'bg-orange-50',icon:'bg-orange-100',text:'text-orange-600',val:'text-orange-700'},
    purple:{bg:'bg-purple-50',icon:'bg-purple-100',text:'text-purple-600',val:'text-purple-700'},
    yellow:{bg:'bg-yellow-50',icon:'bg-yellow-100',text:'text-yellow-600',val:'text-yellow-700'}
  };
  var c=colorMap[props.color||'blue'];
  var IconComp=props.icon;
  return h('div',{className:'bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default'},
    h('div',{className:'flex-shrink-0 w-12 h-12 rounded-xl '+c.icon+' flex items-center justify-center'},
      IconComp?h(IconComp,{size:22,className:c.text}):null
    ),
    h('div',{className:'flex-1 min-w-0'},
      h('p',{className:'text-xs font-medium text-gray-500 uppercase tracking-wide truncate'},props.title),
      h('p',{className:'text-2xl font-bold mt-1 '+(props.critical?'text-red-600':c.val)},props.value),
      props.trend?h('p',{className:'text-xs mt-1 '+(props.trend.startsWith('+')?'text-green-600':'text-red-600')},props.trend):null
    )
  );
};

// ── Modal ─────────────────────────────────────────────────────
window.Modal=function Modal(props){
  if(!props.isOpen)return null;
  var XIcon=icons.X;
  return h('div',{className:'fixed inset-0 z-50 flex items-center justify-center',style:{backgroundColor:'rgba(0,0,0,0.5)'},onClick:function(e){if(e.target===e.currentTarget)props.onClose&&props.onClose();}},
    h('div',{className:'bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto '+(props.size==='lg'?'max-w-2xl':props.size==='xl'?'max-w-4xl':'max-w-lg')+' mx-4'},
      h('div',{className:'flex items-center justify-between p-6 border-b border-gray-100'},
        h('h3',{className:'text-lg font-semibold text-gray-900'},props.title),
        XIcon&&h('button',{onClick:props.onClose,className:'p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors'},h(XIcon,{size:18}))
      ),
      h('div',{className:'p-6'},props.children),
      props.footer&&h('div',{className:'px-6 pb-6 flex gap-3 justify-end border-t border-gray-50 pt-4'},props.footer)
    )
  );
};

// ── OfflineIndicator ──────────────────────────────────────────
window.OfflineIndicator=function OfflineIndicator(props){
  var online=props.isOnline!==false;
  return h('div',{className:'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium '+(online?'bg-green-50 text-green-700':'bg-gray-100 text-gray-500')},
    h('span',{className:'w-1.5 h-1.5 rounded-full '+(online?'bg-green-500':'bg-gray-400')}),
    online?'Online':'Offline'
  );
};

// ── QRDisplay ─────────────────────────────────────────────────
window.QRDisplay=function QRDisplay(props){
  var pid=props.patientId||'SPHC-2026-00000';
  // Deterministic QR-like pattern from patient ID hash
  function charCode(s,i){return s.charCodeAt(i%s.length)||33;}
  var cells=[];
  var size=props.size||120;
  var N=13;
  for(var row=0;row<N;row++){
    for(var col=0;col<N;col++){
      var corner=(row<3&&col<3)||(row<3&&col>=N-3)||(row>=N-3&&col<3);
      var dark=corner?1:((charCode(pid,row*N+col)+row+col)%3===0)?1:0;
      cells.push(h('rect',{key:row+'_'+col,x:col*(size/N),y:row*(size/N),width:size/N,height:size/N,fill:dark?'#1e293b':'white'}));
    }
  }
  // Finder squares
  var fs=size/N;
  return h('div',{className:'flex flex-col items-center gap-2'},
    h('svg',{width:size,height:size,xmlns:'http://www.w3.org/2000/svg',className:'rounded-lg border-2 border-gray-200 p-1'},
      h('rect',{width:size,height:size,fill:'white'}),
      cells,
      // Top-left finder
      h('rect',{x:0,y:0,width:fs*3,height:fs*3,fill:'none',stroke:'#1e293b',strokeWidth:fs*0.8}),
      h('rect',{x:fs*0.8,y:fs*0.8,width:fs*1.4,height:fs*1.4,fill:'#1e293b'}),
      // Top-right finder
      h('rect',{x:fs*(N-3),y:0,width:fs*3,height:fs*3,fill:'none',stroke:'#1e293b',strokeWidth:fs*0.8}),
      h('rect',{x:fs*(N-2.2),y:fs*0.8,width:fs*1.4,height:fs*1.4,fill:'#1e293b'}),
      // Bottom-left finder
      h('rect',{x:0,y:fs*(N-3),width:fs*3,height:fs*3,fill:'none',stroke:'#1e293b',strokeWidth:fs*0.8}),
      h('rect',{x:fs*0.8,y:fs*(N-2.2),width:fs*1.4,height:fs*1.4,fill:'#1e293b'})
    ),
    h('p',{className:'text-xs text-gray-500 font-mono'},pid)
  );
};

// ── AIScoreBar ────────────────────────────────────────────────
window.AIScoreBar=function AIScoreBar(props){
  var spec=props.spec||0;
  var dist=props.dist||0;
  var load=props.load||0;
  var total=spec+dist+load;
  return h('div',{className:'w-full'},
    h('div',{className:'flex h-3 rounded-full overflow-hidden bg-gray-100 mb-2'},
      h('div',{className:'bg-blue-500 transition-all',style:{width:(spec/total*100)+'%'},title:'Specialization'}),
      h('div',{className:'bg-teal-500 transition-all',style:{width:(dist/total*100)+'%'},title:'Distance'}),
      h('div',{className:'bg-green-500 transition-all',style:{width:(load/total*100)+'%'},title:'Patient Load'})
    ),
    h('div',{className:'flex gap-3 text-xs text-gray-500'},
      h('span',{className:'flex items-center gap-1'},h('span',{className:'w-2 h-2 rounded-full bg-blue-500 inline-block'}),'Spec: '+spec.toFixed(2)),
      h('span',{className:'flex items-center gap-1'},h('span',{className:'w-2 h-2 rounded-full bg-teal-500 inline-block'}),'Dist: '+dist.toFixed(2)),
      h('span',{className:'flex items-center gap-1'},h('span',{className:'w-2 h-2 rounded-full bg-green-500 inline-block'}),'Load: '+load.toFixed(2))
    )
  );
};

// ── Toast ─────────────────────────────────────────────────────
window.Toast=function Toast(props){
  if(!props.message)return null;
  var CheckIcon=icons.CheckCircle;var AlertIcon=icons.AlertCircle;
  var isErr=props.type==='error';
  return h('div',{className:'toast fixed bottom-6 right-6 z-50 max-w-sm'},
    h('div',{className:'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border '+(isErr?'bg-red-600 border-red-500':'bg-blue-700 border-blue-600')},
      h('span',{className:'flex-shrink-0 text-white'},isErr?h(AlertIcon,{size:18}):h(CheckIcon,{size:18})),
      h('span',{className:'text-white text-sm font-medium'},props.message)
    )
  );
};

// ── SearchInput ───────────────────────────────────────────────
window.SearchInput=function SearchInput(props){
  var SearchIcon=icons.Search;
  return h('div',{className:'relative'},
    SearchIcon&&h(SearchIcon,{size:16,className:'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'}),
    h('input',{type:'text',placeholder:props.placeholder||'Search...',value:props.value||'',onChange:props.onChange,className:'w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'})
  );
};

// ── StatusWaitColor ───────────────────────────────────────────
window.waitColor=function waitColor(minutes){
  if(minutes<20)return{bg:'bg-green-50',text:'text-green-700',border:'border-green-200',badge:'normal'};
  if(minutes<45)return{bg:'bg-yellow-50',text:'text-yellow-700',border:'border-yellow-200',badge:'moderate'};
  return{bg:'bg-red-50',text:'text-red-700',border:'border-red-200',badge:'critical'};
};

// ── PHCStatusColor ────────────────────────────────────────────
window.phcStatusColor=function phcStatusColor(status){
  if(status==='critical')return{border:'border-l-red-500',bg:'bg-red-50',text:'text-red-700',dot:'bg-red-500'};
  if(status==='moderate')return{border:'border-l-yellow-500',bg:'bg-yellow-50',text:'text-yellow-700',dot:'bg-yellow-500'};
  return{border:'border-l-green-500',bg:'bg-green-50',text:'text-green-700',dot:'bg-green-500'};
};

console.log('[SmartPHC] Utils loaded.');
})();
