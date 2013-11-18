function _clipperz() {
	var container=leftPanel=rightPanel=closeButtons=null;

	/* front-end */
	var setContainer=function(elm) { if(elm) container=elm; }
	this.setContainer=setContainer;
	var setLeftPanel=function(elm) { if(elm) leftPanel=elm; }
	this.setLeftPanel=setLeftPanel;
	var setRightPanel=function(elm) { if(elm) rightPanel=elm; }
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

	/* drag and drop */
	var makeDraggable=function(elm,customOnDragStart,customOnDrag,customOnDragStop) {
		if(!elm) return false;
		if(!customOnDragStart) customOnDragStart=function() {};
		if(!customOnDrag) customOnDrag=function() {};
		if(!customOnDragStop) customOnDragStop=function() {};
		elm.draggable=true;
		elm.customOnDragStart=customOnDragStart;
		elm.customOnDrag=customOnDrag;
		elm.customOnDragStop=customOnDragStop;
		elm.addEventListener("dragstart",onDragStart,false);
		elm.addEventListener("mouseup",onDragStop,false);
		elm.addEventListener("touchstart",onDragStart,false);
		elm.addEventListener("touchmove",onTouchMove,false);
		elm.addEventListener("touchend",onDragStop,false);
		}
	this.makeDraggable=makeDraggable;
	
	var onDragStart=function(e) {
		e.preventDefault();
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
		this.removeEventListener("mousemove",onDrag);
		this.customOnDragStop(e);
		}
	
	}
