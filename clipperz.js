function _clipperz() {
	/*
	LIST OF VARS
	container = main container with all inside
	leftPanel = the black panel on the left
	rightPanel = the black panel on the right
	leftPanelButton = the button that opens the left panel
	rightPanelButton = the button that opens the right panel
	closeButtons = array of elements that appears when a panel is open and by clicking them the panel will be closed
	scrollingBox = the container that scrolls up and down, containing cards, searchbox, tag title, add button...
	cardsContainer = the container of all the cards
	searchBox = the container of the search input
	tagBox = the container of the tag title
	cards = an array of all the avaiable cards
	*/
	var container=leftPanel=rightPanel=leftPanelButton=rightPanelButton=closeButtons=scrollingBox=cardsContainer=searchBox=tagBox=cards=null;
	var ddoffset={x:false,y:false};
	var isDragging=false;


	/* setters (awhf awhf) */
	var setContainer=function(elm) {
		if(elm) {
			container=elm;
			container.style.minHeight=document.body.offsetHeight+'px'; // prevent virtual keyboard to resize body height
			}
		}
	this.setContainer=setContainer;
	var setScrollingBox=function(elm) {
		if(elm) {
			scrollingBox=elm;
			scrollingBox.style.paddingBottom=document.body.offsetHeight+'px';
			}
		}
	this.setScrollingBox=setScrollingBox;
	var setLeftPanel=function(elm,openbutton) { if(elm) leftPanel=elm; if(openbutton) leftPanelButton=openbutton; }
	this.setLeftPanel=setLeftPanel;
	var setRightPanel=function(elm,openbutton) { if(elm) rightPanel=elm; if(openbutton) rightPanelButton=openbutton; }
	this.setRightPanel=setRightPanel;
	var setCloseButtons=function(elms) {
		closeButtons=Array();
		for(i in elms) {
			if(elms[i].addEventListener) {
				elms[i].addEventListener("click",closePanels);
				closeButtons[closeButtons.length]=elms[i];
				}
			}
		hideCloseButtons();
		}
	this.setCloseButtons=setCloseButtons;
	var setCardsContainer=function(elm) {
		if(elm) {
			cardsContainer=elm;
			var c=elm.querySelectorAll(".card"); // get cards list
			cards=Array();
			for(i in c) {
				if(c[i].className=='card') {
					cards[cards.length]=c[i];
					c[i].querySelector(".cardLabel").addEventListener("mouseup",openCloseCard,true);
					// save maximum height
					cc=c[i].querySelector(".fastView");
					cc.openedHeight=cc.offsetHeight;
					cc.style.height=0;
					for(var i=0,inputs=cc.getElementsByTagName('INPUT');inputs[i];i++) {
						inputs[i].addEventListener('click',function() { this.selectionStart=0;this.selectionEnd=this.value.length; }); // select all on click (this works also in iPhone)
						inputs[i].addEventListener('keydown',function(e) { e.preventDefault();e.stopPropagation();return false; }); // make inputs read-only
						}
					}
				}
			}
		}
	this.setCardsContainer=setCardsContainer;
	var setSearchBox=function(elm) {
		if(elm) {
			searchBox=elm;
			var input=searchBox.getElementsByTagName('INPUT')[0];
			if(input) input.addEventListener("change",filter)
			}
		}
	this.setSearchBox=setSearchBox;
	var setTagBox=function(elm) { if(elm) tagBox=elm; }
	this.setTagBox=setTagBox;


	/* activate d&d, controllers etc */
	var initUI=function() {
		// open/close panels
		if(leftPanelButton) leftPanelButton.addEventListener("click",openLeftPanel);
		if(rightPanelButton) rightPanelButton.addEventListener("click",openRightPanel);

		// make the main elements container moveable
		if(scrollingBox) {
			makeDraggable(scrollingBox,scrollingBoxOnDragStart,scrollingBoxOnDrag,scrollingBoxOnDragStop);
			makeScrollable(scrollingBox,scrollingBoxOnMouseWheel);
			}

		// replace all password fields with his copiable alternative
		for(var i=0,p=document.body.getElementsByTagName('INPUT');p[i];i++) {
			if(p[i].type=='password') {
				p[i].type='text';
				p[i].className='password encrypted';
				var c=document.createElement('DIV');
				c.className='passwordContainer';
				p[i].parentNode.insertBefore(c,p[i]);
				c.appendChild(p[i]);
				var sw=document.createElement('DIV');
				sw.className='passwordSwitch';
				sw.innerHTML='locked';
				sw.addEventListener('click',switchPassword);
				c.appendChild(sw);
				}
			}

		}
	this.initUI=initUI;

	/* cards container */
	var scrollingBoxOnDragStart=function(e) {
		this.startingOffsetTop=this.offsetTop;
		}

	var scrollingBoxOnDrag=function(e) {
		if(ddoffset.x==false) {
			ddoffset.y=e.clientY-this.offsetTop;
			ddoffset.x=e.clientX-this.offsetLeft;
			}
		this.className='';
		this.style.top=e.clientY-ddoffset.y+'px';
		}

	var scrollingBoxOnDragStop=function(e) {
		if(e) e.stopPropagation();
			this&&this!=window?elm=this:elm=scrollingBox;
			elm.className='transition';
			if(parseInt(elm.style.top)>document.getElementById('header').offsetHeight*.7) { // if you scroll down for more than 70% of the searchbox, show and focus on the search input
				elm.style.top=document.getElementById('header').offsetHeight+'px';
				if(this.startingOffsetTop<document.getElementById('header').offsetHeight) document.getElementById('searchstring').focus(); // focus on search only if you're opening the searchbar
				}
			else if(parseInt(elm.style.top)>0) elm.style.top=0; // else completely hide the searchbox
			if(parseInt(elm.style.top)<document.body.offsetHeight-scrollingBox.offsetHeight) elm.style.top=document.body.offsetHeight-scrollingBox.offsetHeight+'px';
		ddoffset={x:false,y:false};
		}
	var scrollingBoxOnMouseWheel=function(delta) {
		this.className='transition';
		this.style.top=this.offsetTop+200*delta+'px';
		setTimeout(scrollingBoxOnDragStop,200);
		}

	// show the fastView of a card
	var openCloseCard=function() {
		if(!isDragging) {
			var c=this.parentNode;
			for(var i in cards) { // hide all opened cards
				if(cards[i]!=c) closeCard(cards[i]);
				}
			if(c.className.indexOf("opened")>=0) closeCard(c); // if card you clicked on id open, close it
			else openCard(c); // else open it
			}
		}
	var closeCard=function(card) {
		if(card) {
			card.className=card.className.replace("opened","");
			card.querySelector('.fastView').style.height=0;
			}
		}
	var openCard=function(card) {
		if(card) {
			card.className+=" opened";
			card.querySelector('.fastView').style.height=card.querySelector('.fastView').openedHeight+'px';
			}
		}
	var hideCard=function(card) {
		if(card) {
			closeCard;
			card.className+=" hidden";
			}
		}
	var showCard=function(card) {
		if(card) {
			closeCard;
			card.className=card.className.replace("hidden","");
			}
		}

	// switch the encryption of the password field in the same parent
	var switchPassword=function() {
		var p=this.parentNode.getElementsByTagName('INPUT')[0];
		this.innerHTML=(p.className.indexOf('encrypted')>=0)?'unlocked':'locked';
		p.className=(p.className.indexOf('encrypted')>=0)?p.className.replace('encrypted',''):p.className+' encrypted';
		}



	/* panels */
	var openLeftPanel=function() {
		if(container&&leftPanel) {
			container.style.left=leftPanel.offsetWidth+'px';
			showCloseButtons();
			}
		}
	this.openLeftPanel=openLeftPanel;

	var openRightPanel=function() {
		if(container&&rightPanel) {
			container.style.left=-rightPanel.offsetWidth+'px';
			showCloseButtons();
			}
		}
	this.openRightPanel=openRightPanel;

	var closePanels=function() {
		if(container) {
			container.style.left=0;
			hideCloseButtons();
			}
		}
	this.closePanels=closePanels;
	
	// when a panel is shown, on the inner side must appears an hidden div, pressing that panel will close
	var showCloseButtons=function() {
		for(i in closeButtons) {
			closeButtons[i].style.display='block';
			}
		}
	var hideCloseButtons=function() {
		for(i in closeButtons) {
			closeButtons[i].style.display='none';
			}
		}


	/* cards */
	var filter=function() {
		var searchkey=searchBox.getElementsByTagName('input')[0].value.toLowerCase();
		var tag="";

		for(var i in cards) {
			var contents=cards[i].innerHTML.replace(/<.*?>/,'').toLowerCase();
			if(contents.indexOf(searchkey)>=0) {
				showCard(cards[i]);
				}
			else hideCard(cards[i]);
			}
		}



	/* drag and drop generic functions */
	var makeDraggable=function(elm,customOnDragStart,customOnDrag,customOnDragStop) {
		if(!elm) return false;
		if(!customOnDragStart) customOnDragStart=function() {};
		if(!customOnDrag) customOnDrag=function() {};
		if(!customOnDragStop) customOnDragStop=function() {};
		elm.draggable=true;
		elm.customOnDragStart=customOnDragStart;
		elm.customOnDrag=customOnDrag;
		elm.customOnDragStop=customOnDragStop;
		elm.addEventListener("dragstart",onDragStart);
		elm.addEventListener("mouseup",onDragStop);
		elm.addEventListener("touchstart",onDragStart);
		elm.addEventListener("touchmove",onTouchMove);
		elm.addEventListener("touchend",onDragStop);
		}
	this.makeDraggable=makeDraggable;
	
	var onDragStart=function(e) {
		isDragging=true;
		this.addEventListener("mousemove",onDrag);
		this.customOnDragStart(e);
		}
	var onDrag=function(e) {
		this.customOnDrag(e);
		}
	var onTouchMove=function(e) {
		if(e.touches.length==1) {
			e.preventDefault();
			var touch=e.touches[0];
			this.customOnDrag(touch);
			}
		}
	var onDragStop=function(e) {
		if(isDragging) {
			this.removeEventListener("mousemove",onDrag);
			this.customOnDragStop(e);
			}
		isDragging=false;
		}


	/* custom scroll */
	var makeScrollable=function(elm,customOnScroll) {
		if(!elm) return false;
		elm.customOnScroll=customOnScroll;
		elm.addEventListener("mousewheel",mouseWheelHandler);
		elm.addEventListener("DOMMouseScroll",mouseWheelHandler);
		}
	var mouseWheelHandler=function(e) {
		var delta=Math.max(-1,Math.min(1,(e.wheelDelta||-e.detail)));
		if(this.customOnScroll) this.customOnScroll(delta);
		}
	
	}
