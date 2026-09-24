
// medicine.js - Medicine Inventory with FEFO
(function(){
var R=React; var h=R.createElement; var icons=window.lucideReact||{};

window.MedicineInventoryPage=function MedicineInventoryPage(){
  var ctx=R.useContext(window.AppContext);
  var state=ctx.state; var dispatch=ctx.dispatch;
  var role=state.currentUser?state.currentUser.role:'staff';
  var userPhcId=state.currentUser&&state.currentUser.phcId;
  var selPhcState=R.useState(userPhcId||'All');
  var selPhc=selPhcState[0]; var setSelPhc=selPhcState[1];
  var searchState=R.useState(''); var sv=searchState[0]; var setSv=searchState[1];
  var catState=R.useState('All'); var cat=catState[0]; var setCat=catState[1];
  var statState=R.useState('All'); var statF=statState[0]; var setStatF=statState[1];
  var editState=R.useState(null); var editMed=editState[0]; var setEditMed=editState[1];
  var editQtyState=R.useState(''); var editQty=editQtyState[0]; var setEditQty=editQtyState[1];
  var showAddState=R.useState(false); var showAdd=showAddState[0]; var setShowAdd=showAddState[1];

  var allMeds=state.medicines.filter(function(m){
    var phcOk=(selPhc==='All')||m.phcId===selPhc;
    var searchOk=!sv||m.name.toLowerCase().includes(sv.toLowerCase())||m.batchId.toLowerCase().includes(sv.toLowerCase());
    var catOk=cat==='All'||m.category===cat;
    var statOk=statF==='All'||m.status===statF;
    return phcOk&&searchOk&&catOk&&statOk;
  });

  var cats=['All'].concat([...new Set(state.medicines.map(function(m){return m.category;}))].sort());
  var summaryMeds=(selPhc==='All')?state.medicines:state.medicines.filter(function(m){return m.phcId===selPhc;});
  var summary={total:summaryMeds.length,available:summaryMeds.filter(function(m){return m.status==='available';}).length,low:summaryMeds.filter(function(m){return m.status==='low-stock';}).length,out:summaryMeds.filter(function(m){return m.status==='out-of-stock';}).length,near:summaryMeds.filter(function(m){return m.status==='near-expiry';}).length,exp:summaryMeds.filter(function(m){return m.status==='expired';}).length};

  var criticals=allMeds.filter(function(m){return m.status==='out-of-stock'||m.status==='expired';});
  var AT=icons.AlertTriangle; var Pill=icons.Pill; var Pl=icons.Plus; var Dw=icons.Download;

  return h('div',{className:'space-y-5'},
    h('div',{className:'flex items-center justify-between flex-wrap gap-3'},
      h('div',{},h('h1',{className:'text-xl font-bold text-gray-900'},'Medicine Inventory'),h('p',{className:'text-gray-500 text-sm'},'FEFO (First-Expired-First-Out) tracking \u00b7 '+allMeds.length+' items')),
      h('div',{className:'flex gap-2'},
        h('button',{onClick:function(){setShowAdd(true);},className:'flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700'},Pl&&h(Pl,{size:15}),'Add Medicine'),
        h('button',{onClick:function(){alert('Export ready for backend integration.');},className:'flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200'},Dw&&h(Dw,{size:15}),'Export')
      )
    ),
    criticals.length>0&&h('div',{className:'bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3'},
      AT&&h(AT,{size:18,className:'text-red-600 flex-shrink-0 mt-0.5'}),
      h('div',{},
        h('p',{className:'font-semibold text-red-800 text-sm'},criticals.length+' Critical Medicine Alert'+(criticals.length>1?'s':'')),
        h('p',{className:'text-red-600 text-xs mt-0.5'},criticals.slice(0,3).map(function(m){return m.name+' ('+m.status.replace('-',' ')+')';}).join(' \u00b7 ')+(criticals.length>3?'...':''))
      )
    ),
    h('div',{className:'grid grid-cols-3 sm:grid-cols-6 gap-3'},
      [{l:'Total',v:summary.total,c:'text-gray-900',bg:'bg-white'},{l:'Available',v:summary.available,c:'text-green-700',bg:'bg-green-50'},{l:'Low Stock',v:summary.low,c:'text-orange-700',bg:'bg-orange-50'},{l:'Out of Stock',v:summary.out,c:'text-red-700',bg:'bg-red-50'},{l:'Near Expiry',v:summary.near,c:'text-yellow-700',bg:'bg-yellow-50'},{l:'Expired',v:summary.exp,c:'text-red-700',bg:'bg-red-50'}].map(function(s){
        return h('div',{key:s.l,className:s.bg+' rounded-xl p-3 text-center border border-gray-100'},h('p',{className:'text-xl font-bold '+s.c},s.v),h('p',{className:'text-xs text-gray-500 mt-0.5'},s.l));
      })
    ),
    h('div',{className:'flex flex-wrap gap-3'},
      role!=='staff'&&h('select',{value:selPhc,onChange:function(e){setSelPhc(e.target.value);},className:'px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white'},
        [h('option',{key:'All',value:'All'},'All PHCs')].concat(state.phcs.map(function(p){return h('option',{key:p.id,value:p.id},p.name);}))
      ),
      h(window.SearchInput,{placeholder:'Search medicine or batch...',value:sv,onChange:function(e){setSv(e.target.value);}}),
      h('select',{value:cat,onChange:function(e){setCat(e.target.value);},className:'px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white'},cats.map(function(c){return h('option',{key:c},c);})),
      h('select',{value:statF,onChange:function(e){setStatF(e.target.value);},className:'px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white'},
        ['All','available','low-stock','out-of-stock','near-expiry','expired'].map(function(s){return h('option',{key:s,value:s},s.replace(/-/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();}));}))
    ),
    h('div',{className:'overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm'},
      h('table',{className:'w-full text-sm'},
        h('thead',{},h('tr',{className:'bg-gray-50 border-b border-gray-200'},
          ['Medicine','Category','Batch ID','Qty / Min','Expiry','Status','FEFO','Actions'].map(function(c){return h('th',{key:c,className:'text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'},c);})
        )),
        h('tbody',{},allMeds.map(function(med){
          var rowCls=med.status==='expired'?'bg-red-50/50':med.status==='out-of-stock'?'bg-red-50/30':med.status==='low-stock'?'bg-orange-50/30':'';
          var phcName=role!=='staff'?(state.phcs.find(function(p){return p.id===med.phcId;})||{name:''}).name+' \u00b7 ':'';
          return h('tr',{key:med.id,className:'border-b border-gray-100 hover:bg-gray-50 '+rowCls},
            h('td',{className:'px-4 py-3'},
              h('p',{className:'font-medium text-gray-900 text-sm'},med.name),
              h('p',{className:'text-xs text-gray-400 font-mono'},phcName+med.phcId)
            ),
            h('td',{className:'px-4 py-3 text-gray-600 text-xs'},med.category),
            h('td',{className:'px-4 py-3 text-gray-500 text-xs font-mono'},med.batchId),
            h('td',{className:'px-4 py-3'},
              h('div',{className:'flex items-center gap-1'},
                h('span',{className:'font-semibold '+(med.quantity<med.minStock?'text-red-700':'text-gray-900')},med.quantity),
                h('span',{className:'text-gray-300'},'/'),
                h('span',{className:'text-gray-500 text-xs'},med.minStock)
              ),
              med.quantity>0&&h('div',{className:'mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden w-20'},
                h('div',{className:'h-full rounded-full '+(med.quantity>=med.minStock?'bg-green-500':med.quantity>0?'bg-orange-400':'bg-red-500'),style:{width:Math.min(100,med.quantity/med.minStock*100)+'%'}})
              )
            ),
            h('td',{className:'px-4 py-3 text-xs text-gray-600'},med.expiryDate),
            h('td',{className:'px-4 py-3'},h(window.Badge,{status:med.status},med.status.replace(/-/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();}))),
            h('td',{className:'px-4 py-3'},h('span',{className:'text-xs px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded font-medium'},'FEFO')),
            h('td',{className:'px-4 py-3'},
              h('div',{className:'flex gap-1'},
                h('button',{onClick:function(){dispatch({type:'UPDATE_MEDICINE_STOCK',medicineId:med.id,delta:50});},className:'px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 font-medium'},'+50'),
                h('button',{onClick:function(){dispatch({type:'UPDATE_MEDICINE_STOCK',medicineId:med.id,delta:-10});},className:'px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 font-medium'},'-10'),
                h('button',{onClick:function(){setEditMed(med);setEditQty('');},className:'px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200'},'Issue')
              )
            )
          );
        }))
      )
    ),
    editMed&&h(window.Modal,{isOpen:true,onClose:function(){setEditMed(null);},title:'Issue Medicine: '+editMed.name,footer:[
      h('button',{key:'c',onClick:function(){setEditMed(null);},className:'px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600'},'Cancel'),
      h('button',{key:'ok',onClick:function(){var q=parseInt(editQty,10);if(!isNaN(q)&&q>0){dispatch({type:'UPDATE_MEDICINE_STOCK',medicineId:editMed.id,delta:-q});}setEditMed(null);},className:'px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold'},'Confirm Issue')
    ]},
      h('p',{className:'text-sm text-gray-600 mb-3'},'Current stock: '+h('strong',{},editMed.quantity)+' '+editMed.unit),
      h('label',{className:'block text-sm font-medium text-gray-700 mb-1.5'},'Quantity to Issue'),
      h('input',{type:'number',min:1,max:editMed.quantity,value:editQty,onChange:function(e){setEditQty(e.target.value);},
        placeholder:'Enter quantity',className:'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'})
    )
  );
};

console.log('[SmartPHC] Medicine inventory loaded.');
})();
