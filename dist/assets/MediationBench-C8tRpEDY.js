import{_,c as u,i as y,a as g,b as a,f as c,v,t as f,h,g as o,o as p}from"./index-d6_3zGKW.js";import{c as x}from"./aiService-BzhqgmG8.js";import{A}from"./AiBoundaryNote-D77XED68.js";const k={class:"card"},w={class:"form-row"},B={class:"form-row"},V={class:"ai-row"},D=["disabled"],I={key:0,class:"draft"},N={__name:"MediationBench",setup(C){const s=o(""),r=o(""),d=o(!1),n=o(""),l=o(!1);async function m(){const i=n.value.trim();if(i){l.value=!0;try{const t="你是基层人民调解笔录整理助手。你只能把用户提供的内容整理成“草稿”，不要新增事实；必须标明【需人工核对】。输出应便于调解员直接编辑。",e=`请基于以下转写/对话内容，生成一份调解笔录草稿，格式建议如下：
1）双方陈述（申请人/被申请人分开概述）
2）争议焦点（3条以内）
3）调解员建议与下一步（不做裁决）
4）双方是否达成初步共识（如文本中未体现则写“待确认”）

要求：
- 不得编造原文未包含的事实。
- 全程不输出当事人敏感信息（如身份证号/手机号/准确住址）；若原文包含请用“【隐去】”替换。

转写/对话内容：
${i}`;r.value=await x(e,{system:t,maxTokens:900,temperature:.2}),d.value=!0}finally{l.value=!1}}}function b(){s.value=r.value+`

`+(s.value||"")}return(i,t)=>(p(),u("div",null,[t[5]||(t[5]=y('<h1 class="page-title" data-v-a31e7f92>线上线下调解工作台</h1><p class="page-desc" data-v-a31e7f92>群英主导记录。AI 仅生成“草稿”，最终由群英定稿入台账。</p><div class="card" data-v-a31e7f92><h2 class="h2" data-v-a31e7f92>本场调解</h2><div class="toolbar" data-v-a31e7f92><button type="button" class="btn btn-outline" data-v-a31e7f92>发起线下签到</button><button type="button" class="btn btn-outline" data-v-a31e7f92>发起视频调解</button></div></div>',3)),g(A,{compact:""}),a("div",k,[t[4]||(t[4]=a("h2",{class:"h2"},"调解过程记录",-1)),a("div",w,[t[2]||(t[2]=a("label",{for:"log"},"笔录与协商要点（群英定稿）",-1)),c(a("textarea",{id:"log","onUpdate:modelValue":t[0]||(t[0]=e=>s.value=e),placeholder:"双方陈述、争议焦点、协商过程……"},null,512),[[v,s.value]])]),a("div",B,[t[3]||(t[3]=a("label",{for:"src"},"AI 输入：录音转写/对话内容（粘贴）",-1)),c(a("textarea",{id:"src","onUpdate:modelValue":t[1]||(t[1]=e=>n.value=e),placeholder:"将语音转写结果或聊天要点粘贴在这里（示例：申请人说……被申请人说……）"},null,512),[[v,n.value]])]),a("div",V,[a("button",{type:"button",class:"btn btn-primary",disabled:l.value||!n.value.trim(),onClick:m},f(l.value?"生成中…":"AI 生成笔录草稿（需人工核对）"),9,D)]),d.value?(p(),u("div",I,[a("p",null,f(r.value),1),a("button",{type:"button",class:"btn btn-outline",onClick:b},"插入到编辑区（可再改）")])):h("",!0)])]))}},U=_(N,[["__scopeId","data-v-a31e7f92"]]);export{U as default};
