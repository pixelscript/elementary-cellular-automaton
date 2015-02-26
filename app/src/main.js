var ps = {};
$(function(){
	var Cellula = function(options){
		this.options = options;
		this.overwrite = true;
		this.$parent = $(options.canvas).parent();
		this.canvas = options.canvas;
		this.context = this.canvas.getContext('2d');
		this.pixelSize = 1;
		this.pixels = {};
		this.blockers = {};
		this.blockerCoords = [];
		this.showBlockers = true;
		this.setSize();
	}

	Cellula.prototype.drawBlocker = function(x,y,w,h){
		var blockers = this.blockers;
		this.drawBlock(x,y,20,20,this.getBlockCol(this.showBlockers));
		this.blockerCoords.push({x:x,y:y});
        for(var t=y; t<y+h; t++){
        	if(!blockers[t]){
        		blockers[t] = [];
        	}
	        for(var i=x; i<x+w; i++){
	        	blockers[t][i] = true;
	        }
    	}
	}

	Cellula.prototype.drawBlock = function(x,y,w,h,col){
		var ctx = this.context;
		ctx.fillStyle = col;
        ctx.fillRect (x, y, w, h);
	}

	Cellula.prototype.setSize = function(){
		this.canvas.width = this.width = Math.floor(this.$parent.width());
		this.canvas.height = this.height = Math.floor(this.$parent.height());
		this.redraw();
	}

	Cellula.prototype.redraw = function() {
		this.clear();
		var pixelSize = this.pixelSize;
		this.generateAutomina(this.getDivision(2),this.getDivision(2),0,'r30');
	}

	Cellula.prototype.getDivision = function(d){
		var div = Math.floor((this.width/d)-(this.pixelSize/d));
		div = div-div%this.pixelSize;
		return div;
	}

	Cellula.prototype.getBlockCol = function(show) {
		var col = "rgb(255,255,255)";
		if(show){
			col = "rgba(150,150,150,0.1)";
		}
		return col;
	}

	Cellula.prototype.toggleBlocks = function(show) {
		this.showBlockers = show;
		var col = this.getBlockCol(show);
		for (var i=0;i<this.blockerCoords.length;i++){
			var blocker = this.blockerCoords[i];
			this.drawBlock(blocker.x,blocker.y,20,20,col)
		}

	}

	Cellula.prototype.r90 = function(left,right,center){
		return (left!==right && (left || right));
	}

	Cellula.prototype.r106 = function(left,right,center){
		if (!left && !right && !center) {
			return false
		}
		if (!left && right && !center) {
			return true
		}
		if (!left && !right && center) {
			return false
		}
		if (!left && right && center) {
			return true
		}
		if (left && !right && !center) {
			return false
		}
		if (left && right && !center) {
			return true;
		}
		if (left && !right && center) {
			return true
		}
		if (left && right && center) {
			return false
		}
	}

	Cellula.prototype.r30  = function(left,right,center){
		if((left && center) || (left && right)){
			return false;
		}
		if(left || center || right){
			return true;
		}
		return false;
	}

	Cellula.prototype.generateAutomina = function(leftBound,rightBound,startY,type) {
		var rules = this[type];
		var self = this,
			pixelSize = this.pixelSize,
			pixels = this.pixels,
			blockers = this.blockers;

		startY -= startY%pixelSize;

		if(!pixels[startY] || this.overwrite){
			pixels[startY] = {};
		}

		if(!blockers[startY]){
			blockers[startY] = {};
		}

		if(leftBound!=rightBound){
			leftBound = (leftBound-leftBound%pixelSize);
			rightBound = (rightBound-rightBound%pixelSize)+pixelSize;
			for (var i=leftBound; i<rightBound; i+=pixelSize){
				if (Math.random() >= 0.5) {
					this.drawPixel(i,startY,this.getFunkyColour2(i,startY,255));
					pixels[startY][i] = true;
				}
			}
		} else {
			var startX = leftBound;
			startX -= leftBound%pixelSize;
			this.drawPixel(startX,startY,this.getFunkyColour2(startX,startY,255));
			leftBound = startX-pixelSize;
			rightBound = startX+pixelSize;
			pixels[startY][startX] = true;
		}
		
		for (var y=startY+pixelSize;y<this.height;y+=pixelSize){

			if(!pixels[y] || this.overwrite){
				pixels[y] = {};
			}
			if(!blockers[y]){
				blockers[y] = {};
			}
			for(var x=leftBound; x<=rightBound; x+=pixelSize){
				var left = pixels[(y-pixelSize)][(x-pixelSize)];
				var center = pixels[(y-pixelSize)][x];
				var right = pixels[(y-pixelSize)][(x+pixelSize)];
				var blocker = blockers[y][x];
				if(rules(left,right,center) && (!blocker)) {
					pixels[y][x] = true;
					self.drawPixel(x,y,this.getFunkyColour2(x,y,255));
					self.drawPixel(x+pixelSize,y+pixelSize,this.getFunkyColour1(x+pixelSize,y+pixelSize,255));
				}
			}
			leftBound-=pixelSize;
			rightBound+=pixelSize;
			
			leftBound = Math.max(leftBound,0);
			rightBound = Math.min(rightBound,this.width);
		}
	}

	Cellula.prototype.getFunkyColour1 = function(x,y,range) {
		return "rgb("+range+","+Math.floor(range-(range*(x/this.width)))+","+Math.floor(range-(range*(y/this.height)))+")";
	}

	Cellula.prototype.getFunkyColour2 = function(x,y,range) {
		return "rgb("+Math.floor(range*(x/this.width))+","+Math.floor(range*(y/this.height))+","+range+")";
	}

	Cellula.prototype.drawPixel = function(x,y,col) {
		var ctx = this.context;
		ctx.fillStyle = col;
        ctx.fillRect (x, y, this.pixelSize, this.pixelSize);
	}

	Cellula.prototype.clear = function() {
		this.pixels = {};
		this.blockers = {};
		this.blockerCoords = [];
		var ctx = this.context;
		ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect (0, 0, this.width, this.height);
	}

	ps.Cellula = Cellula;
});