(function(){
  'use strict';

  const qs=(s,c=document)=>c.querySelector(s);
  const qsa=(s,c=document)=>Array.from(c.querySelectorAll(s));

  /* Header and mobile menu */
  const header=qs('.site-header');
  const burger=qs('[data-burger]');
  const mobileNav=qs('[data-mobile-nav]');
  const setHeader=()=>header&&header.classList.toggle('scrolled',window.scrollY>8);
  window.addEventListener('scroll',setHeader,{passive:true}); setHeader();
  if(burger&&mobileNav){
    burger.addEventListener('click',()=>{
      const open=mobileNav.classList.toggle('open');
      burger.setAttribute('aria-expanded',String(open));
    });
    qsa('a',mobileNav).forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');burger.setAttribute('aria-expanded','false');}));
  }

  /* Reveal */
  const reveals=qsa('.reveal');
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}
    }),{threshold:.1,rootMargin:'0px 0px -28px'});
    reveals.forEach(el=>io.observe(el));
  } else reveals.forEach(el=>el.classList.add('visible'));

  /* FAQ */
  qsa('.faq-item').forEach(item=>{
    const btn=qs('.faq-q',item);
    if(!btn)return;
    btn.addEventListener('click',()=>{
      const open=item.classList.contains('open');
      qsa('.faq-item.open',item.parentElement).forEach(x=>x.classList.remove('open'));
      if(!open)item.classList.add('open');
    });
  });

  /* Toast */
  let toast;
  function showToast(text){
    if(!toast){toast=document.createElement('div');toast.className='toast';document.body.appendChild(toast);}
    toast.textContent=text;toast.classList.add('show');clearTimeout(showToast.t);
    showToast.t=setTimeout(()=>toast.classList.remove('show'),3200);
  }

  /* Modal */
  const modal=qs('[data-modal]');
  function openModal(service=''){
    if(!modal)return;
    modal.classList.add('open');document.body.classList.add('modal-open');
    const field=qs('[name="service"]',modal);if(field&&service){let option=Array.from(field.options||[]).find(o=>o.value===service||o.textContent===service);if(!option){option=document.createElement('option');option.value=service;option.textContent=service;field.appendChild(option);}field.value=service;}
    setTimeout(()=>qs('input,select,textarea',modal)?.focus(),80);
  }
  function closeModal(){if(!modal)return;modal.classList.remove('open');document.body.classList.remove('modal-open');}
  qsa('[data-open-modal]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openModal(el.dataset.service||'');}));
  qsa('[data-close-modal]').forEach(el=>el.addEventListener('click',closeModal));
  modal?.addEventListener('click',e=>{if(e.target===modal)closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

  /* Demo forms */
  qsa('[data-lead-form]').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault();
    const fd=new FormData(form);
    const phone=String(fd.get('phone')||'').trim();
    if(!phone){showToast('Укажите телефон, чтобы мы могли связаться.');return;}
    form.reset();closeModal();showToast('Заявка сохранена. Демо-версия работает без отправки на сервер.');
  }));

  /* Audience -> individual solution */
  const businessData={
    shop:{
      name:'Магазины и интернет-торговля',label:'Торговля',color:'#1d65ed',soft:'#e7f0ff',icon:'🛒',
      intro:'Помогаем показать ассортимент, упростить выбор и привести покупателей, которые уже ищут ваш товар.',
      services:['Интернет-каталог или магазин','Карточки товаров и удобный поиск','SEO по категориям и товарам','Контекстная реклама на горячий спрос'],
      result:'Покупатель быстро находит товар, понимает условия и оставляет заказ или переходит к покупке.'
    },
    service:{
      name:'Услуги и специалисты',label:'Услуги',color:'#0eaa8f',soft:'#e5fbf6',icon:'🛠️',
      intro:'Упаковываем услуги так, чтобы клиент сразу понял цену, порядок работы и смог оставить заявку без долгого звонка.',
      services:['Лендинг или многостраничный сайт','Калькулятор стоимости и квиз','Онлайн-запись, формы и мессенджеры','SEO и реклама по конкретным услугам'],
      result:'Меньше вопросов «сколько стоит», больше заполненных расчётов, звонков и записей.'
    },
    build:{
      name:'Строительство и ремонт',label:'Строительство',color:'#f1932b',soft:'#fff0dc',icon:'🏗️',
      intro:'Показываем реальные работы, объясняем этапы и помогаем получать заявки на конкретные виды ремонта или строительства.',
      services:['Каталог услуг и направлений','Портфолио объектов и кейсы','Калькулятор предварительной сметы','Локальное SEO и реклама по региону'],
      result:'Заказчик видит опыт, понимает порядок и отправляет более подготовленную заявку.'
    },
    industry:{
      name:'Производство и B2B',label:'Производство',color:'#5f6b85',soft:'#edf0f5',icon:'🏭',
      intro:'Структурируем сложную продукцию, техническую информацию и путь корпоративного клиента от запроса до коммерческого предложения.',
      services:['Каталог продукции и фильтры','Технические страницы и документы','Формы запроса расчёта или КП','SEO-перенос и продвижение B2B-направлений'],
      result:'Закупщик быстро находит нужную позицию и передаёт в отдел продаж понятный запрос.'
    },
    farm:{
      name:'Фермы и агробизнес',label:'Агробизнес',color:'#39a95d',soft:'#e7f8ec',icon:'🌱',
      intro:'Делаем понятную цифровую витрину для локальных продаж, опта, продукции хозяйства и услуг для агросектора.',
      services:['Каталог продукции и сезонных предложений','Оптовые заявки и быстрый контакт','Локальное продвижение в регионе','Страницы для партнёров и закупщиков'],
      result:'Частный покупатель или оптовик сразу понимает ассортимент, условия и способ заказа.'
    },
    other:{
      name:'Другой малый бизнес',label:'Индивидуально',color:'#d83b87',soft:'#fdeaf3',icon:'💼',
      intro:'Если ваша сфера не помещается в шаблон, разбираем путь клиента и собираем решение под реальную задачу бизнеса.',
      services:['Разбор продукта и аудитории','Индивидуальная структура сайта','Нужные формы, калькуляторы и интеграции','Подбор SEO или рекламного канала'],
      result:'Вы получаете не шаблон «как у всех», а понятный маршрут от интереса клиента до обращения.'
    }
  };
  const solution=qs('[data-solution-panel]');
  function renderSolution(key){
    const d=businessData[key];if(!d||!solution)return;
    solution.style.setProperty('--solution-color',d.color);solution.style.setProperty('--solution-soft',d.soft);
    qs('[data-solution-label]',solution).textContent=d.label;
    qs('[data-solution-title]',solution).textContent=d.name;
    qs('[data-solution-intro]',solution).textContent=d.intro;
    qs('[data-solution-icon]',solution).textContent=d.icon;
    qs('[data-solution-list]',solution).innerHTML=d.services.map(x=>`<li>${x}</li>`).join('');
    qs('[data-solution-result]',solution).textContent=d.result;
    const link=qs('[data-solution-link]',solution);link.href=`pages/quiz.html?business=${encodeURIComponent(key)}&source=audience`;
    solution.classList.add('active');solution.dataset.business=key;
    setTimeout(()=>solution.scrollIntoView({behavior:'smooth',block:'center'}),60);
  }
  qsa('[data-business-card]').forEach(card=>{
    card.addEventListener('click',()=>renderSolution(card.dataset.businessCard));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();renderSolution(card.dataset.businessCard);}});
  });
  qs('[data-solution-back]')?.addEventListener('click',()=>{
    solution?.classList.remove('active');
    qs('#audiences')?.scrollIntoView({behavior:'smooth',block:'start'});
  });

  /* Expandable case cards */
  qsa('[data-case-toggle]').forEach(btn=>btn.addEventListener('click',()=>{
    const card=btn.closest('.case-card');const open=card.classList.toggle('expanded');
    btn.textContent=open?'Скрыть подробности':'Краткие подробности';
  }));

  /* Quiz */
  const quizzes=qsa('[data-quiz]');
  quizzes.forEach(initQuiz);
  function initQuiz(quiz){
    const state={goal:null,business:null,site:null,budget:null};
    const params=new URLSearchParams(location.search);
    const pre=params.get('business');
    if(pre&&businessData[pre])state.business=pre;

    let steps=qsa('.quiz-step',quiz);
    if(pre){
      const businessStep=qs('.quiz-step[data-field="business"]',quiz);
      if(businessStep)businessStep.remove();
      const note=qs('[data-prefill-note]',quiz);
      if(note){note.textContent=`Сфера уже выбрана: ${businessData[pre].name}. Повторно спрашивать её не будем.`;note.classList.add('show');}
    }
    steps=qsa('.quiz-step',quiz);
    const bars=qs('.quiz-progress',quiz);
    if(bars){bars.innerHTML=steps.map(()=>'<span></span>').join('');}
    let current=0;

    const goalMap={clients:{label:'Новые заявки и клиенты',services:['SEO-продвижение','Контекстная реклама'],base:[450,900]},site:{label:'Новый сайт',services:['Сайт или лендинг под ключ'],base:[800,2200]},both:{label:'Сайт и продвижение',services:['Сайт','SEO или контекст'],base:[1500,3600]},improve:{label:'Улучшить действующий сайт',services:['Редизайн','SEO-аудит'],base:[600,2100]}};
    const siteMap={none:'Сайта нет',old:'Есть, но устарел',ok:'Есть и работает',landing:'Есть только визитка / лендинг'};
    const budgetMap={start:{label:'До 500 BYN в месяц',mult:.75},mid:{label:'500–1 500 BYN в месяц',mult:1},growth:{label:'1 500–3 000 BYN в месяц',mult:1.35},max:{label:'От 3 000 BYN в месяц',mult:1.7},unknown:{label:'Пока не определён',mult:1}};

    function update(){
      qsa('.quiz-progress span',quiz).forEach((b,i)=>{b.classList.toggle('done',i<current);b.classList.toggle('active',i===current);});
      steps.forEach((s,i)=>s.classList.toggle('active',i===current));
      const set=(sel,text)=>{const el=qs(sel,quiz);if(el)el.textContent=text||'—';};
      set('[data-sum-goal]',state.goal?goalMap[state.goal].label:'—');
      set('[data-sum-business]',state.business?businessData[state.business].name:'—');
      set('[data-sum-site]',state.site?siteMap[state.site]:'—');
      set('[data-sum-budget]',state.budget?budgetMap[state.budget].label:'—');
      set('[data-sum-services]',state.goal?goalMap[state.goal].services.join(', '):'—');
      if(state.goal){const m=state.budget?budgetMap[state.budget].mult:1;const b=goalMap[state.goal].base;set('[data-estimate]',`от ${Math.round(b[0]*m)}–${Math.round(b[1]*m)} BYN`);}else set('[data-estimate]','подберём после ответов');
      const form=qs('form',quiz);if(form){
        Object.entries(state).forEach(([k,v])=>{let input=qs(`[name="${k}"]`,form);if(!input){input=document.createElement('input');input.type='hidden';input.name=k;form.appendChild(input);}input.value=k==='business'&&v?businessData[v].name:v||'';});
      }
      const prev=qs('[data-prev]',quiz);if(prev)prev.style.visibility=current===0?'hidden':'visible';
      const next=qs('[data-next]',quiz);if(next)next.style.display=current===steps.length-1?'none':'inline-flex';
    }
    qsa('[data-option]',quiz).forEach(btn=>btn.addEventListener('click',()=>{
      const group=btn.dataset.group,value=btn.dataset.option;
      qsa(`[data-group="${group}"]`,quiz).forEach(x=>x.classList.remove('selected'));
      btn.classList.add('selected');state[group]=value;update();
    }));
    qs('[data-next]',quiz)?.addEventListener('click',()=>{
      const req=steps[current]?.dataset.requires;
      if(req&&!state[req]){showToast('Выберите один из вариантов, чтобы продолжить.');return;}
      current=Math.min(current+1,steps.length-1);update();
    });
    qs('[data-prev]',quiz)?.addEventListener('click',()=>{current=Math.max(0,current-1);update();});
    const form=qs('form',quiz);
    form?.addEventListener('submit',e=>{
      e.preventDefault();
      const phone=String(new FormData(form).get('phone')||'').trim();
      if(!phone){showToast('Укажите телефон.');return;}
      qsa('.quiz-step',quiz).forEach(s=>s.classList.remove('active'));
      qs('.quiz-nav',quiz)?.remove();qs('.quiz-progress',quiz)?.remove();
      const success=qs('.quiz-success',quiz);if(success)success.classList.add('active');
      showToast('Спасибо! В демо-версии данные не отправляются на сервер.');
    });
    update();
  }

})();

/* Services page widgets */
(function(){
  'use strict';
  const qs=(s,c=document)=>c.querySelector(s);
  const qsa=(s,c=document)=>Array.from(c.querySelectorAll(s));

  const wireframeData={
    hero:{step:'Этап 1',title:'Главный экран: предложение и действие',text:'За несколько секунд человек должен понять, что вы предлагаете, кому это подходит и какое действие сделать дальше.'},
    trust:{step:'Этап 2',title:'Доверие: факты, опыт и доказательства',text:'Показываем реальные работы, условия, процесс, команду и подтверждения, которые снижают сомнения перед обращением.'},
    offer:{step:'Этап 3',title:'Услуги, работы или товарное предложение',text:'Структурируем выбор так, чтобы человек быстро нашёл нужное, понял отличия и не потерялся в длинном списке.'},
    capture:{step:'Этап 4',title:'Калькулятор, квиз или форма заявки',text:'Даём понятный следующий шаг: рассчитать стоимость, ответить на несколько вопросов, записаться или оставить контакт.'},
    faq:{step:'Этап 5',title:'Вопросы, контакты и реквизиты',text:'Закрываем сомнения по срокам, оплате, гарантиям и показываем, как связаться с компанией удобным способом.'}
  };
  const wfTitle=qs('[data-wireframe-title]');
  const wfText=qs('[data-wireframe-text]');
  const wfStep=qs('[data-wireframe-step]');
  qsa('[data-wireframe]').forEach(btn=>btn.addEventListener('click',()=>{
    qsa('[data-wireframe]').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const item=wireframeData[btn.dataset.wireframe];
    if(!item)return;
    if(wfTitle)wfTitle.textContent=item.title;
    if(wfText)wfText.textContent=item.text;
    if(wfStep)wfStep.textContent=item.step;
  }));

  const traffic=qs('#roi-traffic'),conversion=qs('#roi-conv'),ticket=qs('#roi-ticket');
  const format=n=>Number(n).toLocaleString('ru-RU');
  function updateRoi(){
    if(!traffic||!conversion||!ticket)return;
    const visits=Number(traffic.value),conv=Number(conversion.value),avg=Number(ticket.value);
    const leads=Math.round(visits*conv/100);
    const revenue=leads*avg;
    const profit=Math.round(revenue*.35);
    const investment=1200;
    const roi=Math.round((profit-investment)/investment*100);
    const set=(sel,text)=>{const el=qs(sel);if(el)el.textContent=text;};
    set('#val-traffic',format(visits));
    set('#val-conv',`${conv}%`);
    set('#val-ticket',`${format(avg)} BYN`);
    set('#metric-leads',format(leads));
    set('#metric-revenue',`${format(revenue)} BYN`);
    set('#metric-profit',`${format(profit)} BYN`);
    const roiEl=qs('#grand-roi');
    if(roiEl){roiEl.textContent=`${roi>0?'+':''}${roi}%`;roiEl.style.color=roi>=0?'#1454e8':'#111827';}
  }
  [traffic,conversion,ticket].filter(Boolean).forEach(el=>el.addEventListener('input',updateRoi));
  updateRoi();

  const jumpLinks=qsa('.service-jump a');
  if(jumpLinks.length && 'IntersectionObserver' in window){
    const sections=jumpLinks.map(a=>qs(a.getAttribute('href'))).filter(Boolean);
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      jumpLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${visible.target.id}`));
    },{rootMargin:'-25% 0px -60% 0px',threshold:[0,.2,.5]});
    sections.forEach(s=>observer.observe(s));
  }
})();


/* REF WEB final interaction pass */
(function(){
  'use strict';
  const qs=(s,c=document)=>c.querySelector(s);
  const qsa=(s,c=document)=>Array.from(c.querySelectorAll(s));

  // Hero analytics: count, hover is CSS-only, click/keyboard flips the card.
  const analytics=qs('[data-analytics-card]');
  if(analytics){
    const flip=()=>{const on=analytics.classList.toggle('is-flipped');analytics.setAttribute('aria-pressed',String(on));};
    analytics.addEventListener('click',flip);
    analytics.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip();}});
    const animateNumbers=()=>qsa('[data-counter]',analytics).forEach(el=>{
      const target=Number(el.dataset.counter||0), suffix=el.dataset.suffix||'';
      const decimals=String(target).includes('.')?1:0, start=performance.now(), duration=1050;
      const tick=now=>{const t=Math.min(1,(now-start)/duration), eased=1-Math.pow(1-t,3);const v=target*eased;el.textContent=(target>0&&suffix==='%'?'+':'')+v.toLocaleString('ru-RU',{minimumFractionDigits:decimals,maximumFractionDigits:decimals})+suffix;if(t<1)requestAnimationFrame(tick);};
      requestAnimationFrame(tick);
    });
    if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){analytics.classList.add('is-visible');animateNumbers();io.disconnect();}},{threshold:.35});io.observe(analytics);}else{analytics.classList.add('is-visible');animateNumbers();}
  }

  // Horizontal process. Nothing advances automatically: initial state is always step one.
  const process=qs('[data-process]');
  if(process){
    const data=[
      {title:'Погружение',text:'Фиксируем продукт, аудиторию, ограничения и бизнес-цели.',result:'Бриф и зафиксированные цели',do:'Проводим стартовую встречу, разбираем продукт, клиентов, конкурентов и ограничения проекта.',client:'Ответить на вопросы по бизнесу, показать текущие материалы и обозначить приоритеты.',time:'1–2 рабочих дня'},
      {title:'Стратегия',text:'Расставляем приоритеты и определяем структуру решения.',result:'План работ и приоритеты',do:'Определяем, какие страницы, функции и каналы продвижения действительно нужны для задачи.',client:'Подтвердить приоритеты, бюджетный диапазон и ключевые направления.',time:'2–3 рабочих дня'},
      {title:'Проектирование',text:'Собираем сценарии, контент и визуальное направление.',result:'Прототип и карта страниц',do:'Проектируем путь пользователя, структуру блоков, формы, калькуляторы и логику переходов.',client:'Проверить прототип и дать конкретную обратную связь по содержанию.',time:'3–7 рабочих дней'},
      {title:'Реализация',text:'Создаём дизайн, страницы, материалы и интеграции.',result:'Рабочая версия продукта',do:'Верстаем адаптивный интерфейс, программируем логику, подключаем формы и необходимые интеграции.',client:'Передать финальные материалы и оперативно согласовывать контрольные точки.',time:'5–15 рабочих дней'},
      {title:'Запуск',text:'Проверяем формы, аналитику, скорость и мобильные версии.',result:'Проверенный релиз',do:'Тестируем сценарии, исправляем ошибки, подключаем аналитику и публикуем проект.',client:'Предоставить доступы к домену, хостингу и рабочим сервисам.',time:'1–3 рабочих дня'},
      {title:'Развитие',text:'Усиливаем контент, продвижение и функциональность.',result:'Следующий цикл роста',do:'Анализируем обращения и поведение пользователей, усиливаем страницы, рекламу и SEO.',client:'Передавать обратную связь от отдела продаж и подтверждать новые приоритеты.',time:'По согласованному циклу'}
    ];
    const range=qs('[data-process-range]',process), fill=qs('[data-process-fill]',process), markers=qsa('[data-process-step]',process);
    const set=(n,open=false)=>{n=Math.max(1,Math.min(6,Number(n)||1));range.value=n;fill.style.width=`${(n-1)/5*100}%`;markers.forEach((m,i)=>m.classList.toggle('active',i===n-1));const d=data[n-1];qs('[data-process-index]',process).textContent=`Этап 0${n}`;qs('[data-process-title]',process).textContent=d.title;qs('[data-process-text]',process).textContent=d.text;qs('[data-process-result]',process).textContent=d.result;process.dataset.current=n;if(open)openProcess(n);};
    range.addEventListener('input',()=>set(range.value));
    markers.forEach(m=>m.addEventListener('click',()=>set(m.dataset.processStep,true)));
    qs('[data-process-more]',process)?.addEventListener('click',()=>openProcess(Number(process.dataset.current||1)));
    const modal=qs('[data-process-modal]');
    function openProcess(n){if(!modal)return;const d=data[n-1];qs('[data-process-modal-index]',modal).textContent=`Этап 0${n}`;qs('[data-process-modal-title]',modal).textContent=d.title;qs('[data-process-modal-do]',modal).textContent=d.do;qs('[data-process-modal-client]',modal).textContent=d.client;qs('[data-process-modal-result]',modal).textContent=d.result;qs('[data-process-modal-time]',modal).textContent=d.time;modal.classList.add('open');document.body.classList.add('modal-open');}
    const close=()=>{modal?.classList.remove('open');document.body.classList.remove('modal-open');};
    qsa('[data-process-close]').forEach(b=>b.addEventListener('click',close));modal?.addEventListener('click',e=>{if(e.target===modal)close();});qsa('[data-process-modal] [data-open-modal]').forEach(b=>b.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal?.classList.contains('open'))close();});
    set(1);
  }

  // Styled range fill on services calculator.
  qsa('.roi-slider-group input[type="range"]').forEach(input=>{
    const paint=()=>{const min=Number(input.min)||0,max=Number(input.max)||100,val=Number(input.value);input.style.setProperty('--range-progress',`${(val-min)/(max-min)*100}%`);};
    input.addEventListener('input',paint);paint();
  });
})();
