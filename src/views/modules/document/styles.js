export default `
/* ----- THEME ----- */
/* VARIABLES */
:root {
  --p0:#2CDD93;/* Medium Aquamarine light */
  --p1:#1F74D6;/* Bright Navy Blue light */
  --p2:hsl(267, 50%, 55%);/* Royal Purple light */
  --p3:#E21893;/* Barbie Pink light */
  --p4:#FF6263;/* Bittersweet Orange light */
  --p5:hsl(267, 75%, 45%);/* Royal purple */
  --g0:#FBFBFB;/* #FBFBFB */
  --g1:#E5E5E5;/* #E5E5E5 */
  --g2:#CFCFCF;/* #CFCFCF */
  --g3:#BABABA;/* #BABABA */
  --g4:#A4A4A4;/* #A4A4A4 */
  --g5:#8E8E8E;/* #8E8E8E */
  --g6:#797979;/* #797979 */
  --g7:#636363;/* #636363 */
  --g8:#4D4D4D;/* #4D4D4D */
  --g9:#383838;/* #383838 */
  --g10:#222222;/* #222222 */
  --h0:#3EE09C;/* Medium Aquamarine */
  --h1:#2a80e0;/* Bright Navy Blue */
  --h2:hsl(267, 90%, 55%);/* Royal Purple Hover */
  --h3:#DE1792;/* Barbie Pink */
  --h4:#FF4747;/* Bittersweet Orange */
  --h5:#FAE05D;/* Minion Yellow */
  --a0:#A4A4A4;/* #A4A4A4 */
  --a1:#8E8E8E;/* #8E8E8E */
  --d0:#797979;/* #797979 */
  --d1:#636363;/* #636363 */
}

/* RESET */
*,
*:before,
*:after {
  margin: 0;
  padding: 0;
  border: none;
  box-sizing: border-box;
}
img {max-width: 100%;}
svg {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
select,
textarea,
button,
input {font-family: inherit;}


/* TYPEFACE */
html {font-size: 18px;}
body {
  font-weight: normal;
  line-height: 1.5;
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}


/* COLOR */
.text-current{color:currentColor;}/* current color */
.text-transparent{color:transparent;}/* transparent */
.text-p0{color:var(--p0);}/* Medium Aquamarine light */
.text-p1{color:var(--p1);}/* Bright Navy Blue light */
.text-p2{color:var(--p2);}/* Royal Purple light */
.text-p3{color:var(--p3);}/* Barbie Pink light */
.text-p4{color:var(--p4);}/* Bittersweet Orange light */
.text-p5{color:var(--p5);}/* Royal purple */
.text-g0{color:var(--g0);}/* #FBFBFB */
.text-g1{color:var(--g1);}/* #E5E5E5 */
.text-g2{color:var(--g2);}/* #CFCFCF */
.text-g3{color:var(--g3);}/* #BABABA */
.text-g4{color:var(--g4);}/* #A4A4A4 */
.text-g5{color:var(--g5);}/* #8E8E8E */
.text-g6{color:var(--g6);}/* #797979 */
.text-g7{color:var(--g7);}/* #636363 */
.text-g8{color:var(--g8);}/* #4D4D4D */
.text-g9{color:var(--g9);}/* #383838 */
.text-g10{color:var(--g10);}/* #222222 */
.text-h0:hover{color:var(--h0);}/* Medium Aquamarine */
.text-h1:hover{color:var(--h1);}/* Bright Navy Blue */
.text-h2:hover{color:var(--h2);}/* Royal Purple Hover */
.text-h3:hover{color:var(--h3);}/* Barbie Pink */
.text-h4:hover{color:var(--h4);}/* Bittersweet Orange */
.text-h5:hover{color:var(--h5);}/* Minion Yellow */
.text-a0:active{color:var(--a0);}/* #A4A4A4 */
.text-a0.active{color:var(--a0);}/* #A4A4A4 */
.text-a1:active{color:var(--a1);}/* #8E8E8E */
.text-a1.active{color:var(--a1);}/* #8E8E8E */
.text-d0:disabled{color:var(--d0);}/* #797979 */
.text-d1:disabled{color:var(--d1);}/* #636363 */


/* BACKGROUND */
.bg-fixed{background-attachment:fixed;}
.bg-local{background-attachment:local;}
.bg-scroll{background-attachment:scroll;}
.bg-bottom{background-position:bottom;}
.bg-center{background-position:center;}
.bg-left{background-position:left;}
.bg-left-bottom{background-position:left bottom;}
.bg-left-top{background-position:left top;}
.bg-right{background-position:right;}
.bg-right-bottom{background-position:right bottom;}
.bg-right-top{background-position:right top;}
.bg-top{background-position:top;}
.bg-repeat{background-repeat:repeat;}
.bg-no-repeat{background-repeat:no-repeat;}
.bg-repeat-x{background-repeat:repeat-x;}
.bg-repeat-y{background-repeat:repeat-y;}
.bg-repeat-round{background-repeat:round;}
.bg-repeat-space{background-repeat:space;}
.bg-auto{background-size:auto;}
.bg-cover{background-size:cover;}
.bg-contain{background-size:contain;}
.bg-unset{background-color:unset;}
.bg-p0{background-color:var(--p0);}
.bg-p1{background-color:var(--p1);}
.bg-p2{background-color:var(--p2);}
.bg-p3{background-color:var(--p3);}
.bg-p4{background-color:var(--p4);}
.bg-p5{background-color:var(--p5);}
.bg-g0{background-color:var(--g0);}
.bg-g1{background-color:var(--g1);}
.bg-g2{background-color:var(--g2);}
.bg-g3{background-color:var(--g3);}
.bg-g4{background-color:var(--g4);}
.bg-g5{background-color:var(--g5);}
.bg-g6{background-color:var(--g6);}
.bg-g7{background-color:var(--g7);}
.bg-g8{background-color:var(--g8);}
.bg-g9{background-color:var(--g9);}
.bg-g10{background-color:var(--g10);}
.bg-h0:hover{background-color:var(--h0);}
.bg-h1:hover{background-color:var(--h1);}
.bg-h2:hover{background-color:var(--h2);}
.bg-h3:hover{background-color:var(--h3);}
.bg-h4:hover{background-color:var(--h4);}
.bg-h5:hover{background-color:var(--h5);}
.bg-a0:active{background-color:var(--a0);}
.bg-a0.active{background-color:var(--a0);}
.bg-a1:active{background-color:var(--a1);}
.bg-a1.active{background-color:var(--a1);}
.bg-d0:disabled{background-color:var(--d0);}
.bg-d1:disabled{background-color:var(--d1);}


  /* GRADIENT */.bg-image0{background-image:linear-gradient(0.4turn, #0100ca, #00e5ff, #f50057);}/* outrun */


/* BORDER */
.border-solid{border-style:solid;}
.border-dashed{border-style:dashed;}
.border-dotted{border-style:dotted;}
.border-double{border-style:double;}
.border-none{border-style:none;}
.border-t-none{border-top:none;}
.border-r-none{border-right:none;}
.border-b-none{border-bottom:none;}
.border-l-none{border-left:none;}

.border0{border-width:0px;}
.border-t0{border-top-width:0px;}
.border-r0{border-right-width:0px;}
.border-b0{border-bottom-width:0px;}
.border-l0{border-left-width:0px;}
.border1{border-width:1px;}
.border-t1{border-top-width:1px;}
.border-r1{border-right-width:1px;}
.border-b1{border-bottom-width:1px;}
.border-l1{border-left-width:1px;}
.border2{border-width:2px;}
.border-t2{border-top-width:2px;}
.border-r2{border-right-width:2px;}
.border-b2{border-bottom-width:2px;}
.border-l2{border-left-width:2px;}
.border3{border-width:4px;}
.border-t3{border-top-width:4px;}
.border-r3{border-right-width:4px;}
.border-b3{border-bottom-width:4px;}
.border-l3{border-left-width:4px;}
.border4{border-width:8px;}
.border-t4{border-top-width:8px;}
.border-r4{border-right-width:8px;}
.border-b4{border-bottom-width:8px;}
.border-l4{border-left-width:8px;}
.border5{border-width:16px;}
.border-t5{border-top-width:16px;}
.border-r5{border-right-width:16px;}
.border-b5{border-bottom-width:16px;}
.border-l5{border-left-width:16px;}
.border6{border-width:32px;}
.border-t6{border-top-width:32px;}
.border-r6{border-right-width:32px;}
.border-b6{border-bottom-width:32px;}
.border-l6{border-left-width:32px;}.border-p0{border-color:var(--p0);}/* Medium Aquamarine light */.border-p1{border-color:var(--p1);}/* Bright Navy Blue light */.border-p2{border-color:var(--p2);}/* Royal Purple light */.border-p3{border-color:var(--p3);}/* Barbie Pink light */.border-p4{border-color:var(--p4);}/* Bittersweet Orange light */.border-p5{border-color:var(--p5);}/* Royal purple */.border-g0{border-color:var(--g0);}/* #FBFBFB */.border-g1{border-color:var(--g1);}/* #E5E5E5 */.border-g2{border-color:var(--g2);}/* #CFCFCF */.border-g3{border-color:var(--g3);}/* #BABABA */.border-g4{border-color:var(--g4);}/* #A4A4A4 */.border-g5{border-color:var(--g5);}/* #8E8E8E */.border-g6{border-color:var(--g6);}/* #797979 */.border-g7{border-color:var(--g7);}/* #636363 */.border-g8{border-color:var(--g8);}/* #4D4D4D */.border-g9{border-color:var(--g9);}/* #383838 */.border-g10{border-color:var(--g10);}/* #222222 */.border-h0:hover{border-color:var(--h0);}/* Medium Aquamarine */
.border-h1:hover{border-color:var(--h1);}/* Bright Navy Blue */
.border-h2:hover{border-color:var(--h2);}/* Royal Purple Hover */
.border-h3:hover{border-color:var(--h3);}/* Barbie Pink */
.border-h4:hover{border-color:var(--h4);}/* Bittersweet Orange */
.border-h5:hover{border-color:var(--h5);}/* Minion Yellow */
.border-a0:active{border-color:var(--a0);}/* #A4A4A4 */
.border-a0.active{border-color:var(--a0);}/* #A4A4A4 */
.border-a1:active{border-color:var(--a1);}/* #8E8E8E */
.border-a1.active{border-color:var(--a1);}/* #8E8E8E */
.border-d0:disabled{border-color:var(--d0);}/* #797979 */
.border-d1:disabled{border-color:var(--d1);}/* #636363 */


/* RADIUS */
.radius-none{border-radius:0;}
.radius-100{border-radius:100%;}
.radius-pill{border-radius:9999px;}
.radius-tr-none{border-top-right-radius:0;}
.radius-br-none{border-bottom-right-radius:0;}
.radius-tl-none{border-top-left-radius:0;}
.radius-bl-none{border-bottom-left-radius:0;}
.radius0{border-radius:4px;}
.radius1{border-radius:6px;}
.radius2{border-radius:15px;}
.radius3{border-radius:9999px;}


/* FILL */
.fill-none{fill:none;}
.fill-current{fill:currentColor;}


/* STROKE */
.stroke-none{stroke:none;}
.stroke-current{stroke:currentColor;}



/* CONTAINER  */
.container{max-width:100%;}



/* FAMILY */
.font-sans{font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";}
.font-serif{font-family: Georgia, Cambria, "Times New Roman", Times, serif;}
.font-mono{font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;}


/* SIZES */
.text5{font-size:4.209rem;}/* 75.757px */
.text4{font-size:3.157rem;}/* 56.832px */
.text3{font-size:2.369rem;}/* 42.635px */
.text2{font-size:1.777rem;}/* 31.984px */
.text1{font-size:1.333rem;}/* 23.994px */
.text0{font-size:1rem;}/* 18px */
.text-1{font-size:0.75rem;}/* 13.503px */
.text-2{font-size:0.563rem;}/* 10.13px */
.text-3{font-size:0.422rem;}/* 7.599px */
.text-4{font-size:0.317rem;}/* 5.701px */
.text-5{font-size:0.238rem;}/* 4.277px */


/* Style */
.italic{font-style:italic;}
.not-italic{font-style:normal;}


/* LINE HEIGHT */
.leading5{line-height: 2;}
.leading4{line-height: 1.625;}
.leading3{line-height: 1.5;}
.leading2{line-height: 1.375;}
.leading1{line-height: 1.25;}
.leading0,
.leading-none{line-height:1;}


/* TRACKING */
.tracking3{letter-spacing: 0.1em;}
.tracking2{letter-spacing: 0.05em;}
.tracking1{letter-spacing: 0.025em;}
.tracking0{letter-spacing: 0;}
.tracking-1{letter-spacing: -0.025em;}
.tracking-2{letter-spacing: -0.05em;}


/* WEIGHTS */
.font-hairline{font-weight:100;}
.font-thin{font-weight:200;}
.font-light{font-weight:300;}
.font-normal{font-weight:400;}
.font-medium{font-weight:500;}
.font-semibold{font-weight:600;}
.font-bold{font-weight:700;}
.font-extrabold{font-weight:800;}
.font-black{font-weight:900;}


/* TEXT TRANSFORM */
.uppercase{text-transform:uppercase;}
.lowercase{text-transform:lowercase;}
.capitalize{text-transform:capitalize;}
.normal-case{text-transform:none;}


/* ALIGN */
.text-inherit{text-align:inherit;}
.text-center{text-align:center;}
.text-left{text-align:left;}
.text-right{text-align:right;}


/* DECORATION */
.no-underline{text-decoration:none;}
.underline{text-decoration:underline;}
.line-through{text-decoration:line-through;}


/* LIST */
.list-none{list-style:none;}
.list-disc{list-style:disc;}
.list-decimal{list-style:decimal;}


/* WHITESPACE */
.whitespace-normal{white-space:normal;}
.truncate,
.whitespace-no-wrap{white-space:nowrap;}
.whitespace-pre{white-space:pre;}
.whitespace-pre-line{white-space:pre-line;}
.whitespace-pre-wrap{white-space:pre-wrap;}


/* WORDBREAK */
.break-normal{word-break:normal;}
.break-normal,
.break-words{overflow-wrap:normal;}
.break-all{word-break:break-all;}
.truncate,
.ellipsis{text-overflow:ellipsis;}



/* -----  LAYOUT ----- */


/* POSITION */
.sticky{position:sticky;}
.static{position:static;}
.absolute{position:absolute;}
.relative{position:relative;}
.fixed{position:fixed;}


 /* POSITIONING */
.top0{top:0;}
.left0{left:0;}
.right0{right:0;}
.bottom0{bottom:0;}


/* DISPLAY */
.hidden{display:none;}
.block{display:block;}
.inline{display:inline;}
.inline-block{display:inline-block;}
.flex{display:flex;}
.inline-flex{display:inline-flex;}
.grid{display:grid;}
.inline-grid{display:inline-grid;}


/* WIDTH */
.w-0{width:0;}
.w-full{width:100%;}
.w-screen{width:100vw;}
.min-w-0{min-width:0;}
.min-w-full{min-width:100%;}
.max-width-none{max-width:none;}
.max-w-full{max-width:100%;}


/* HEIGHT */
.h-0{height:0;}
.h-full{height:100%;}
.h-screen{height:100vh;}
.min-h-0{min-height:0;}
.min-h-full{min-height:100%;}
.min-h-screen{min-height:100vh;}
.max-h-full{max-height:100%;}
.max-h-screen{max-height:100vh;}


/* FLEX */
.flex-1{flex: 1 1 0%;}
.flex-auto{flex: 1 1 auto;}
.flex-initial{flex: 0 1 auto;}
.flex-none{flex:none;}
.flex-row{flex-direction:row;}
.flex-row-reverse{flex-direction:row-reverse;}
.flex-col{flex-direction:column;}
.flex-col-reverse{flex-direction:column-reverse;}
.items-stretch{align-items:stretch;}
.items-start{align-items:flex-start;}
.items-end{align-items:flex-end;}
.items-center{align-items:center;}
.content-start{align-content:start;}
.content-center{align-content:center;}
.content-end{align-content:end;}
.content-between{align-content:space-between;}
.content-around{align-content:space-around;}
.self-auto{align-self:auto;}
.self-start{align-self:flex-start;}
.self-end{align-self:flex-end;}
.self-center{align-self:center;}
.self-stretch{align-self:stretch;}
.justify-start{justify-content:flex-start;}
.justify-end{justify-content: flex-end;}
.justify-around{justify-content:space-around;}
.justify-between{justify-content:space-between;}
.justify-center{justify-content:center;}
.flex-grow{flex-grow:1;}
.flex-grow-0{flex-grow:0;}
.flex-shrink{flex-shrink:1;}
.flex-shrink-0{flex-shrink:0;}
.flex-wrap{flex-wrap:wrap;}
.flex-wrap-reverse{flex-wrap:wrap-reverse;}
.flex-no-wrap{flex-wrap:nowrap;}
.order-first{order:-9999;}
.order-last{order:9999;}
.order-none{order:0;}
.order-1{order:1;}
.order-2{order:2;}
.order-3{order:3;}
.order-4{order:4;}
.order-5{order:5;}
.order-6{order:6;}


/* GRID */
.flow-row{grid-auto-flow:row;}
.flow-col{grid-auto-flow:column;}
.flow-row-dense{grid-auto-flow:row dense;}
.flow-column-dense{grid-auto-flow:column dense;}
.row-auto{grid-row:auto;}
.col-auto{grid-column:auto;}
.col-end-auto{grid-column-end: auto;}
.rows-end-auto{grid-row-end:auto;}
.rows-none{grid-template-rows:none;}
.col-1{grid-template-columns:repeat(1, minmax(0, 1fr));}
.col-span-1{grid-column: span 1 / span 1;}
.col-start-1{grid-column-start: 1;}
.row-start-1{grid-row-start: 1;}
.col-end-1{grid-column-end: 1;}
.row-end-1{grid-row-end: 1;}
.row-1{grid-template-rows: repeat(1, minmax(0, 1fr));}
.col-2{grid-template-columns:repeat(2, minmax(0, 1fr));}
.col-span-2{grid-column: span 2 / span 2;}
.col-start-2{grid-column-start: 2;}
.row-start-2{grid-row-start: 2;}
.col-end-2{grid-column-end: 2;}
.row-end-2{grid-row-end: 2;}
.row-2{grid-template-rows: repeat(2, minmax(0, 1fr));}
.col-3{grid-template-columns:repeat(3, minmax(0, 1fr));}
.col-span-3{grid-column: span 3 / span 3;}
.col-start-3{grid-column-start: 3;}
.row-start-3{grid-row-start: 3;}
.col-end-3{grid-column-end: 3;}
.row-end-3{grid-row-end: 3;}
.row-3{grid-template-rows: repeat(3, minmax(0, 1fr));}
.col-4{grid-template-columns:repeat(4, minmax(0, 1fr));}
.col-span-4{grid-column: span 4 / span 4;}
.col-start-4{grid-column-start: 4;}
.row-start-4{grid-row-start: 4;}
.col-end-4{grid-column-end: 4;}
.row-end-4{grid-row-end: 4;}
.row-4{grid-template-rows: repeat(4, minmax(0, 1fr));}
.col-5{grid-template-columns:repeat(5, minmax(0, 1fr));}
.col-span-5{grid-column: span 5 / span 5;}
.col-start-5{grid-column-start: 5;}
.row-start-5{grid-row-start: 5;}
.col-end-5{grid-column-end: 5;}
.row-end-5{grid-row-end: 5;}
.row-5{grid-template-rows: repeat(5, minmax(0, 1fr));}
.col-6{grid-template-columns:repeat(6, minmax(0, 1fr));}
.col-span-6{grid-column: span 6 / span 6;}
.col-start-6{grid-column-start: 6;}
.row-start-6{grid-row-start: 6;}
.col-end-6{grid-column-end: 6;}
.row-end-6{grid-row-end: 6;}
.row-6{grid-template-rows: repeat(6, minmax(0, 1fr));}
.row-auto-160{grid-auto-rows:minmax(8.889rem, auto);}
.gap4{gap:4.209rem;}
.gap3{gap:3.157rem;}
.gap2{gap:2.369rem;}
.gap1{gap:1.777rem;}
.gap0{gap:1.333rem;}
.gap-1{gap:1rem;}
.gap-2{gap:0.75rem;}
.gap-3{gap:0.563rem;}
.gap-4{gap:0.422rem;}
.gap-5{gap:0.317rem;}
.gap-6{gap:0.238rem;}


/* Z-INDEX */
.z-auto{z-index:auto;}
.z1{z-index:1;}
.z0{z-index:0;}
.z-1{z-index:-1;}



/* MARGIN */
.m-none{margin:0;}
.mt-none{margin-top:0;}
.mr-none{margin-right:0;}
.mb-none{margin-bottom:0;}
.ml-none{margin-left:0;}
.m-auto{margin-right:auto;margin-left:auto;}
.mr-auto{margin-right:auto;}
.ml-auto{margin-left:auto;}
.m5{margin:4.209rem;}
.mt5{margin-top:4.209rem;}
.mr5{margin-right:4.209rem;}
.mb5{margin-bottom:4.209rem;}
.ml5{margin-left:4.209rem;}
.m4{margin:3.157rem;}
.mt4{margin-top:3.157rem;}
.mr4{margin-right:3.157rem;}
.mb4{margin-bottom:3.157rem;}
.ml4{margin-left:3.157rem;}
.m3{margin:2.369rem;}
.mt3{margin-top:2.369rem;}
.mr3{margin-right:2.369rem;}
.mb3{margin-bottom:2.369rem;}
.ml3{margin-left:2.369rem;}
.m2{margin:1.777rem;}
.mt2{margin-top:1.777rem;}
.mr2{margin-right:1.777rem;}
.mb2{margin-bottom:1.777rem;}
.ml2{margin-left:1.777rem;}
.m1{margin:1.333rem;}
.mt1{margin-top:1.333rem;}
.mr1{margin-right:1.333rem;}
.mb1{margin-bottom:1.333rem;}
.ml1{margin-left:1.333rem;}
.m0{margin:1rem;}
.mt0{margin-top:1rem;}
.mr0{margin-right:1rem;}
.mb0{margin-bottom:1rem;}
.ml0{margin-left:1rem;}
.m-1{margin:0.75rem;}
.mt-1{margin-top:0.75rem;}
.mr-1{margin-right:0.75rem;}
.mb-1{margin-bottom:0.75rem;}
.ml-1{margin-left:0.75rem;}
.m-2{margin:0.563rem;}
.mt-2{margin-top:0.563rem;}
.mr-2{margin-right:0.563rem;}
.mb-2{margin-bottom:0.563rem;}
.ml-2{margin-left:0.563rem;}
.m-3{margin:0.422rem;}
.mt-3{margin-top:0.422rem;}
.mr-3{margin-right:0.422rem;}
.mb-3{margin-bottom:0.422rem;}
.ml-3{margin-left:0.422rem;}
.m-4{margin:0.317rem;}
.mt-4{margin-top:0.317rem;}
.mr-4{margin-right:0.317rem;}
.mb-4{margin-bottom:0.317rem;}
.ml-4{margin-left:0.317rem;}
.m-5{margin:0.238rem;}
.mt-5{margin-top:0.238rem;}
.mr-5{margin-right:0.238rem;}
.mb-5{margin-bottom:0.238rem;}
.ml-5{margin-left:0.238rem;}


/* PADDING */
.p-none{padding:0;}
.pt-none{padding-top:0;}
.pr-none{padding-right:0;}
.pb-none{padding-bottom:0;}
.pl-none{padding-left:0;}
.p5{padding:4.209rem;}
.pt5{padding-top:4.209rem;}
.pr5{padding-right:4.209rem;}
.pb5{padding-bottom:4.209rem;}
.pl5{padding-left:4.209rem;}
.p4{padding:3.157rem;}
.pt4{padding-top:3.157rem;}
.pr4{padding-right:3.157rem;}
.pb4{padding-bottom:3.157rem;}
.pl4{padding-left:3.157rem;}
.p3{padding:2.369rem;}
.pt3{padding-top:2.369rem;}
.pr3{padding-right:2.369rem;}
.pb3{padding-bottom:2.369rem;}
.pl3{padding-left:2.369rem;}
.p2{padding:1.777rem;}
.pt2{padding-top:1.777rem;}
.pr2{padding-right:1.777rem;}
.pb2{padding-bottom:1.777rem;}
.pl2{padding-left:1.777rem;}
.p1{padding:1.333rem;}
.pt1{padding-top:1.333rem;}
.pr1{padding-right:1.333rem;}
.pb1{padding-bottom:1.333rem;}
.pl1{padding-left:1.333rem;}
.p0{padding:1rem;}
.pt0{padding-top:1rem;}
.pr0{padding-right:1rem;}
.pb0{padding-bottom:1rem;}
.pl0{padding-left:1rem;}
.p-1{padding:0.75rem;}
.pt-1{padding-top:0.75rem;}
.pr-1{padding-right:0.75rem;}
.pb-1{padding-bottom:0.75rem;}
.pl-1{padding-left:0.75rem;}
.p-2{padding:0.563rem;}
.pt-2{padding-top:0.563rem;}
.pr-2{padding-right:0.563rem;}
.pb-2{padding-bottom:0.563rem;}
.pl-2{padding-left:0.563rem;}
.p-3{padding:0.422rem;}
.pt-3{padding-top:0.422rem;}
.pr-3{padding-right:0.422rem;}
.pb-3{padding-bottom:0.422rem;}
.pl-3{padding-left:0.422rem;}
.p-4{padding:0.317rem;}
.pt-4{padding-top:0.317rem;}
.pr-4{padding-right:0.317rem;}
.pb-4{padding-bottom:0.317rem;}
.pl-4{padding-left:0.317rem;}
.p-5{padding:0.238rem;}
.pt-5{padding-top:0.238rem;}
.pr-5{padding-right:0.238rem;}
.pb-5{padding-bottom:0.238rem;}
.pl-5{padding-left:0.238rem;}


/* OVERFLOW */
.overflow-auto{overflow:auto;}
.truncate,
.overflow-hidden{overflow:hidden;}
.overflow-visible{overflow:visible;}
.overflow-scroll{overflow:scroll;}
.overflow-x-auto{overflow-x:auto;}
.overflow-y-auto{overflow-y:auto;}
.overflow-x-scroll{overflow-x:scroll;}
.overflow-x-hidden{overflow-x:hidden;}
.overflow-y-scroll{overflow-y:scroll;}
.overflow-y-hidden{overflow-y:hidden;}
.scrolling-touch{webkit-overflow-scrolling:touch;}
.scrolling-auto{webkit-overflow-scrolling:auto;}


/* VISIBILITY */
.invisible{visibility:hidden;}
.visible{visibility:visible;}


/* OBJECT FIT */
.object-contain{object-fit:contain;}
.object-cover{object-fit:cover;}
.object-fill{object-fit:fill;}
.object-none{object-fit:none;}
.object-scale-down{object-fit:scale-down;}


/* OBJECT POSITION */
.object-b{object-position:bottom;}
.object-c{object-position:center;}
.object-t{object-position:top;}
.object-r{object-position:right;}
.object-rt{object-position:right top;}
.object-rb{object-position:right bottom;}
.object-l{object-position:left;}
.object-lt{object-position:left top;}
.object-lb{object-position:left bottom;}


/* OUTLINE */
.outline-none{outline:0;}


/* OPACITY */
.opacity-0{opacity:0;}
.opacity-25{opacity:0.25;}
.opacity-50{opacity:0.5;}
.opacity-75{opacity:0.75;}
.opacity-100{opacity:1.0;}


/* CURSOR */
.cursor-auto{cursor:auto;}
.cursor-default{cursor:default;}
.cursor-pointer{cursor:pointer;}
.cursor-wait{cursor:wait;}
.cursor-text{cursor:text;}
.cursor-move{cursor:move;}
.cursor-not-allowed{cursor:not-allowed;}
.cursor-grab{cursor:grab;}
.cursor-grabbing{cursor:grabbing;}


/* USER SELECT */
.select-none{user-select:none;}
.select-text{user-select:text;}
.select-all{user-select:all;}
.select-auto{user-select:auto;}


@media only screen and (min-width:48em) {


/* CONTAINER  */
.container-lg{max-width:48em;}



/* FAMILY */
.font-sans-lg{font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";}
.font-serif-lg{font-family: Georgia, Cambria, "Times New Roman", Times, serif;}
.font-mono-lg{font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;}


/* SIZES */
.text5-lg{font-size:4.209rem;}/* 75.757px */
.text4-lg{font-size:3.157rem;}/* 56.832px */
.text3-lg{font-size:2.369rem;}/* 42.635px */
.text2-lg{font-size:1.777rem;}/* 31.984px */
.text1-lg{font-size:1.333rem;}/* 23.994px */
.text0-lg{font-size:1rem;}/* 18px */
.text-1-lg{font-size:0.75rem;}/* 13.503px */
.text-2-lg{font-size:0.563rem;}/* 10.13px */
.text-3-lg{font-size:0.422rem;}/* 7.599px */
.text-4-lg{font-size:0.317rem;}/* 5.701px */
.text-5-lg{font-size:0.238rem;}/* 4.277px */


/* Style */
.italic-lg{font-style:italic;}
.not-italic-lg{font-style:normal;}


/* LINE HEIGHT */
.leading5-lg{line-height: 2;}
.leading4-lg{line-height: 1.625;}
.leading3-lg{line-height: 1.5;}
.leading2-lg{line-height: 1.375;}
.leading1-lg{line-height: 1.25;}
.leading0-lg,
.leading-none-lg{line-height:1;}


/* TRACKING */
.tracking3-lg{letter-spacing: 0.1em;}
.tracking2-lg{letter-spacing: 0.05em;}
.tracking1-lg{letter-spacing: 0.025em;}
.tracking0-lg{letter-spacing: 0;}
.tracking-1-lg{letter-spacing: -0.025em;}
.tracking-2-lg{letter-spacing: -0.05em;}


/* WEIGHTS */
.font-hairline-lg{font-weight:100;}
.font-thin-lg{font-weight:200;}
.font-light-lg{font-weight:300;}
.font-normal-lg{font-weight:400;}
.font-medium-lg{font-weight:500;}
.font-semibold-lg{font-weight:600;}
.font-bold-lg{font-weight:700;}
.font-extrabold-lg{font-weight:800;}
.font-black-lg{font-weight:900;}


/* TEXT TRANSFORM */
.uppercase-lg{text-transform:uppercase;}
.lowercase-lg{text-transform:lowercase;}
.capitalize-lg{text-transform:capitalize;}
.normal-case-lg{text-transform:none;}


/* ALIGN */
.text-inherit-lg{text-align:inherit;}
.text-center-lg{text-align:center;}
.text-left-lg{text-align:left;}
.text-right-lg{text-align:right;}


/* DECORATION */
.no-underline-lg{text-decoration:none;}
.underline-lg{text-decoration:underline;}
.line-through-lg{text-decoration:line-through;}


/* LIST */
.list-none-lg{list-style:none;}
.list-disc-lg{list-style:disc;}
.list-decimal-lg{list-style:decimal;}


/* WHITESPACE */
.whitespace-normal-lg{white-space:normal;}
.truncate,
.whitespace-no-wrap-lg{white-space:nowrap;}
.whitespace-pre-lg{white-space:pre;}
.whitespace-pre-line-lg{white-space:pre-line;}
.whitespace-pre-wrap-lg{white-space:pre-wrap;}


/* WORDBREAK */
.break-normal-lg{word-break:normal;}
.break-normal,
.break-words-lg{overflow-wrap:normal;}
.break-all-lg{word-break:break-all;}
.truncate,
.ellipsis-lg{text-overflow:ellipsis;}



/* -----  LAYOUT ----- */


/* POSITION */
.sticky-lg{position:sticky;}
.static-lg{position:static;}
.absolute-lg{position:absolute;}
.relative-lg{position:relative;}
.fixed-lg{position:fixed;}


 /* POSITIONING */
.top0-lg{top:0;}
.left0-lg{left:0;}
.right0-lg{right:0;}
.bottom0-lg{bottom:0;}


/* DISPLAY */
.hidden-lg{display:none;}
.block-lg{display:block;}
.inline-lg{display:inline;}
.inline-block-lg{display:inline-block;}
.flex-lg{display:flex;}
.inline-flex-lg{display:inline-flex;}
.grid-lg{display:grid;}
.inline-grid-lg{display:inline-grid;}


/* WIDTH */
.w-0-lg{width:0;}
.w-full-lg{width:100%;}
.w-screen-lg{width:100vw;}
.min-w-0-lg{min-width:0;}
.min-w-full-lg{min-width:100%;}
.max-width-none-lg{max-width:none;}
.max-w-full-lg{max-width:100%;}


/* HEIGHT */
.h-0-lg{height:0;}
.h-full-lg{height:100%;}
.h-screen-lg{height:100vh;}
.min-h-0-lg{min-height:0;}
.min-h-full-lg{min-height:100%;}
.min-h-screen-lg{min-height:100vh;}
.max-h-full-lg{max-height:100%;}
.max-h-screen-lg{max-height:100vh;}


/* FLEX */
.flex-1-lg{flex: 1 1 0%;}
.flex-auto-lg{flex: 1 1 auto;}
.flex-initial-lg{flex: 0 1 auto;}
.flex-none-lg{flex:none;}
.flex-row-lg{flex-direction:row;}
.flex-row-reverse-lg{flex-direction:row-reverse;}
.flex-col-lg{flex-direction:column;}
.flex-col-reverse-lg{flex-direction:column-reverse;}
.items-stretch-lg{align-items:stretch;}
.items-start-lg{align-items:flex-start;}
.items-end-lg{align-items:flex-end;}
.items-center-lg{align-items:center;}
.content-start-lg{align-content:start;}
.content-center-lg{align-content:center;}
.content-end-lg{align-content:end;}
.content-between-lg{align-content:space-between;}
.content-around-lg{align-content:space-around;}
.self-auto-lg{align-self:auto;}
.self-start-lg{align-self:flex-start;}
.self-end-lg{align-self:flex-end;}
.self-center-lg{align-self:center;}
.self-stretch-lg{align-self:stretch;}
.justify-start-lg{justify-content:flex-start;}
.justify-end-lg{justify-content: flex-end;}
.justify-around-lg{justify-content:space-around;}
.justify-between-lg{justify-content:space-between;}
.justify-center-lg{justify-content:center;}
.flex-grow-lg{flex-grow:1;}
.flex-grow-0-lg{flex-grow:0;}
.flex-shrink-lg{flex-shrink:1;}
.flex-shrink-0-lg{flex-shrink:0;}
.flex-wrap-lg{flex-wrap:wrap;}
.flex-wrap-reverse-lg{flex-wrap:wrap-reverse;}
.flex-no-wrap-lg{flex-wrap:nowrap;}
.order-first-lg{order:-9999;}
.order-last-lg{order:9999;}
.order-none-lg{order:0;}
.order-1-lg{order:1;}
.order-2-lg{order:2;}
.order-3-lg{order:3;}
.order-4-lg{order:4;}
.order-5-lg{order:5;}
.order-6-lg{order:6;}


/* GRID */
.flow-row-lg{grid-auto-flow:row;}
.flow-col-lg{grid-auto-flow:column;}
.flow-row-dense-lg{grid-auto-flow:row dense;}
.flow-column-dense-lg{grid-auto-flow:column dense;}
.row-auto-lg{grid-row:auto;}
.col-auto-lg{grid-column:auto;}
.col-end-auto-lg{grid-column-end: auto;}
.rows-end-auto-lg{grid-row-end:auto;}
.rows-none-lg{grid-template-rows:none;}
.col-1-lg{grid-template-columns:repeat(1, minmax(0, 1fr));}
.col-span-1-lg{grid-column: span 1 / span 1;}
.col-start-1-lg{grid-column-start: 1;}
.row-start-1-lg{grid-row-start: 1;}
.col-end-1-lg{grid-column-end: 1;}
.row-end-1-lg{grid-row-end: 1;}
.row-1-lg{grid-template-rows: repeat(1, minmax(0, 1fr));}
.col-2-lg{grid-template-columns:repeat(2, minmax(0, 1fr));}
.col-span-2-lg{grid-column: span 2 / span 2;}
.col-start-2-lg{grid-column-start: 2;}
.row-start-2-lg{grid-row-start: 2;}
.col-end-2-lg{grid-column-end: 2;}
.row-end-2-lg{grid-row-end: 2;}
.row-2-lg{grid-template-rows: repeat(2, minmax(0, 1fr));}
.col-3-lg{grid-template-columns:repeat(3, minmax(0, 1fr));}
.col-span-3-lg{grid-column: span 3 / span 3;}
.col-start-3-lg{grid-column-start: 3;}
.row-start-3-lg{grid-row-start: 3;}
.col-end-3-lg{grid-column-end: 3;}
.row-end-3-lg{grid-row-end: 3;}
.row-3-lg{grid-template-rows: repeat(3, minmax(0, 1fr));}
.col-4-lg{grid-template-columns:repeat(4, minmax(0, 1fr));}
.col-span-4-lg{grid-column: span 4 / span 4;}
.col-start-4-lg{grid-column-start: 4;}
.row-start-4-lg{grid-row-start: 4;}
.col-end-4-lg{grid-column-end: 4;}
.row-end-4-lg{grid-row-end: 4;}
.row-4-lg{grid-template-rows: repeat(4, minmax(0, 1fr));}
.col-5-lg{grid-template-columns:repeat(5, minmax(0, 1fr));}
.col-span-5-lg{grid-column: span 5 / span 5;}
.col-start-5-lg{grid-column-start: 5;}
.row-start-5-lg{grid-row-start: 5;}
.col-end-5-lg{grid-column-end: 5;}
.row-end-5-lg{grid-row-end: 5;}
.row-5-lg{grid-template-rows: repeat(5, minmax(0, 1fr));}
.col-6-lg{grid-template-columns:repeat(6, minmax(0, 1fr));}
.col-span-6-lg{grid-column: span 6 / span 6;}
.col-start-6-lg{grid-column-start: 6;}
.row-start-6-lg{grid-row-start: 6;}
.col-end-6-lg{grid-column-end: 6;}
.row-end-6-lg{grid-row-end: 6;}
.row-6-lg{grid-template-rows: repeat(6, minmax(0, 1fr));}
.row-auto-160-lg{grid-auto-rows:minmax(8.889rem, auto);}
.gap4-lg{gap:4.209rem;}
.gap3-lg{gap:3.157rem;}
.gap2-lg{gap:2.369rem;}
.gap1-lg{gap:1.777rem;}
.gap0-lg{gap:1.333rem;}
.gap-1-lg{gap:1rem;}
.gap-2-lg{gap:0.75rem;}
.gap-3-lg{gap:0.563rem;}
.gap-4-lg{gap:0.422rem;}
.gap-5-lg{gap:0.317rem;}
.gap-6-lg{gap:0.238rem;}


/* Z-INDEX */
.z-auto-lg{z-index:auto;}
.z1-lg{z-index:1;}
.z0-lg{z-index:0;}
.z-1-lg{z-index:-1;}



/* MARGIN */
.m-none-lg{margin:0;}
.mt-none-lg{margin-top:0;}
.mr-none-lg{margin-right:0;}
.mb-none-lg{margin-bottom:0;}
.ml-none-lg{margin-left:0;}
.m-auto-lg{margin-right:auto;margin-left:auto;}
.mr-auto-lg{margin-right:auto;}
.ml-auto-lg{margin-left:auto;}
.m5-lg{margin:4.209rem;}
.mt5-lg{margin-top:4.209rem;}
.mr5-lg{margin-right:4.209rem;}
.mb5-lg{margin-bottom:4.209rem;}
.ml5-lg{margin-left:4.209rem;}
.m4-lg{margin:3.157rem;}
.mt4-lg{margin-top:3.157rem;}
.mr4-lg{margin-right:3.157rem;}
.mb4-lg{margin-bottom:3.157rem;}
.ml4-lg{margin-left:3.157rem;}
.m3-lg{margin:2.369rem;}
.mt3-lg{margin-top:2.369rem;}
.mr3-lg{margin-right:2.369rem;}
.mb3-lg{margin-bottom:2.369rem;}
.ml3-lg{margin-left:2.369rem;}
.m2-lg{margin:1.777rem;}
.mt2-lg{margin-top:1.777rem;}
.mr2-lg{margin-right:1.777rem;}
.mb2-lg{margin-bottom:1.777rem;}
.ml2-lg{margin-left:1.777rem;}
.m1-lg{margin:1.333rem;}
.mt1-lg{margin-top:1.333rem;}
.mr1-lg{margin-right:1.333rem;}
.mb1-lg{margin-bottom:1.333rem;}
.ml1-lg{margin-left:1.333rem;}
.m0-lg{margin:1rem;}
.mt0-lg{margin-top:1rem;}
.mr0-lg{margin-right:1rem;}
.mb0-lg{margin-bottom:1rem;}
.ml0-lg{margin-left:1rem;}
.m-1-lg{margin:0.75rem;}
.mt-1-lg{margin-top:0.75rem;}
.mr-1-lg{margin-right:0.75rem;}
.mb-1-lg{margin-bottom:0.75rem;}
.ml-1-lg{margin-left:0.75rem;}
.m-2-lg{margin:0.563rem;}
.mt-2-lg{margin-top:0.563rem;}
.mr-2-lg{margin-right:0.563rem;}
.mb-2-lg{margin-bottom:0.563rem;}
.ml-2-lg{margin-left:0.563rem;}
.m-3-lg{margin:0.422rem;}
.mt-3-lg{margin-top:0.422rem;}
.mr-3-lg{margin-right:0.422rem;}
.mb-3-lg{margin-bottom:0.422rem;}
.ml-3-lg{margin-left:0.422rem;}
.m-4-lg{margin:0.317rem;}
.mt-4-lg{margin-top:0.317rem;}
.mr-4-lg{margin-right:0.317rem;}
.mb-4-lg{margin-bottom:0.317rem;}
.ml-4-lg{margin-left:0.317rem;}
.m-5-lg{margin:0.238rem;}
.mt-5-lg{margin-top:0.238rem;}
.mr-5-lg{margin-right:0.238rem;}
.mb-5-lg{margin-bottom:0.238rem;}
.ml-5-lg{margin-left:0.238rem;}


/* PADDING */
.p-none-lg{padding:0;}
.pt-none-lg{padding-top:0;}
.pr-none-lg{padding-right:0;}
.pb-none-lg{padding-bottom:0;}
.pl-none-lg{padding-left:0;}
.p5-lg{padding:4.209rem;}
.pt5-lg{padding-top:4.209rem;}
.pr5-lg{padding-right:4.209rem;}
.pb5-lg{padding-bottom:4.209rem;}
.pl5-lg{padding-left:4.209rem;}
.p4-lg{padding:3.157rem;}
.pt4-lg{padding-top:3.157rem;}
.pr4-lg{padding-right:3.157rem;}
.pb4-lg{padding-bottom:3.157rem;}
.pl4-lg{padding-left:3.157rem;}
.p3-lg{padding:2.369rem;}
.pt3-lg{padding-top:2.369rem;}
.pr3-lg{padding-right:2.369rem;}
.pb3-lg{padding-bottom:2.369rem;}
.pl3-lg{padding-left:2.369rem;}
.p2-lg{padding:1.777rem;}
.pt2-lg{padding-top:1.777rem;}
.pr2-lg{padding-right:1.777rem;}
.pb2-lg{padding-bottom:1.777rem;}
.pl2-lg{padding-left:1.777rem;}
.p1-lg{padding:1.333rem;}
.pt1-lg{padding-top:1.333rem;}
.pr1-lg{padding-right:1.333rem;}
.pb1-lg{padding-bottom:1.333rem;}
.pl1-lg{padding-left:1.333rem;}
.p0-lg{padding:1rem;}
.pt0-lg{padding-top:1rem;}
.pr0-lg{padding-right:1rem;}
.pb0-lg{padding-bottom:1rem;}
.pl0-lg{padding-left:1rem;}
.p-1-lg{padding:0.75rem;}
.pt-1-lg{padding-top:0.75rem;}
.pr-1-lg{padding-right:0.75rem;}
.pb-1-lg{padding-bottom:0.75rem;}
.pl-1-lg{padding-left:0.75rem;}
.p-2-lg{padding:0.563rem;}
.pt-2-lg{padding-top:0.563rem;}
.pr-2-lg{padding-right:0.563rem;}
.pb-2-lg{padding-bottom:0.563rem;}
.pl-2-lg{padding-left:0.563rem;}
.p-3-lg{padding:0.422rem;}
.pt-3-lg{padding-top:0.422rem;}
.pr-3-lg{padding-right:0.422rem;}
.pb-3-lg{padding-bottom:0.422rem;}
.pl-3-lg{padding-left:0.422rem;}
.p-4-lg{padding:0.317rem;}
.pt-4-lg{padding-top:0.317rem;}
.pr-4-lg{padding-right:0.317rem;}
.pb-4-lg{padding-bottom:0.317rem;}
.pl-4-lg{padding-left:0.317rem;}
.p-5-lg{padding:0.238rem;}
.pt-5-lg{padding-top:0.238rem;}
.pr-5-lg{padding-right:0.238rem;}
.pb-5-lg{padding-bottom:0.238rem;}
.pl-5-lg{padding-left:0.238rem;}


/* OVERFLOW */
.overflow-auto-lg{overflow:auto;}
.truncate,
.overflow-hidden-lg{overflow:hidden;}
.overflow-visible-lg{overflow:visible;}
.overflow-scroll-lg{overflow:scroll;}
.overflow-x-auto-lg{overflow-x:auto;}
.overflow-y-auto-lg{overflow-y:auto;}
.overflow-x-scroll-lg{overflow-x:scroll;}
.overflow-x-hidden-lg{overflow-x:hidden;}
.overflow-y-scroll-lg{overflow-y:scroll;}
.overflow-y-hidden-lg{overflow-y:hidden;}
.scrolling-touch-lg{webkit-overflow-scrolling:touch;}
.scrolling-auto-lg{webkit-overflow-scrolling:auto;}


/* VISIBILITY */
.invisible-lg{visibility:hidden;}
.visible-lg{visibility:visible;}


/* OBJECT FIT */
.object-contain-lg{object-fit:contain;}
.object-cover-lg{object-fit:cover;}
.object-fill-lg{object-fit:fill;}
.object-none-lg{object-fit:none;}
.object-scale-down-lg{object-fit:scale-down;}


/* OBJECT POSITION */
.object-b-lg{object-position:bottom;}
.object-c-lg{object-position:center;}
.object-t-lg{object-position:top;}
.object-r-lg{object-position:right;}
.object-rt-lg{object-position:right top;}
.object-rb-lg{object-position:right bottom;}
.object-l-lg{object-position:left;}
.object-lt-lg{object-position:left top;}
.object-lb-lg{object-position:left bottom;}


/* OUTLINE */
.outline-none-lg{outline:0;}


/* OPACITY */
.opacity-0-lg{opacity:0;}
.opacity-25-lg{opacity:0.25;}
.opacity-50-lg{opacity:0.5;}
.opacity-75-lg{opacity:0.75;}
.opacity-100-lg{opacity:1.0;}


/* CURSOR */
.cursor-auto-lg{cursor:auto;}
.cursor-default-lg{cursor:default;}
.cursor-pointer-lg{cursor:pointer;}
.cursor-wait-lg{cursor:wait;}
.cursor-text-lg{cursor:text;}
.cursor-move-lg{cursor:move;}
.cursor-not-allowed-lg{cursor:not-allowed;}
.cursor-grab-lg{cursor:grab;}
.cursor-grabbing-lg{cursor:grabbing;}


/* USER SELECT */
.select-none-lg{user-select:none;}
.select-text-lg{user-select:text;}
.select-all-lg{user-select:all;}
.select-auto-lg{user-select:auto;}

}
`
