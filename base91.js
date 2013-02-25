/*
 * Base91 ENCODE/DECODE JavaScript implementation
 * 
 * @author Mohammed Adnane Morabet, (Free to use, but leave my name)
 * --------------------------------------------
 * based on https://github.com/bwaldvogel/base91 
 *          http://pastebin.com/64nK7acE 
 *
 * Usage : BasE91.encode('toencode');
 *         BasE91.decode('encoded');
 */


var BasE91 = (function(fromCharCode, parseInt){
  
	var be = this;
	
	be.edic   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"',
	be.ddic   = [],be.ebp,be.enm,be.estr,be.dbp,be.dnm,be.dv,be.dstr,
	be.eClear = function(){
	   this.ebp = 0, this.enm = 0, this.estr = '';
	},
	be.dClear = function(){
	   this.dbp = 0, this.dnm = 0, this.dstr = '', this.dv = -1;
	};

   be.eClear();
   be.dClear();
   
   var i = 256;
   while(i--) be.ddic[i] = -1;
   i = 91;
   while(i--) be.ddic[be.edic.charCodeAt(i)] = i;
   delete i;
   
   return {
	   
	   buildEncode: function(string){

			var i, ev, x = 0;
			
			while(!isNaN(i = string.charCodeAt(x++))){
			  var addStrs = [];
			  while(parseInt(i/256)){
				addStrs.unshift(i%256);
				i = parseInt(i/256);
			  }
			  addStrs.unshift(i);
			  var Z;
			  for(Z in addStrs){
				be.ebp |= (addStrs[Z] & 255) << be.enm;
				if((be.enm += 8) > 13){
				  if((be.ev = be.ebp & 8191) > 88){
					be.ebp >>= 13;
					be.enm -=  13;
				  }else{
					be.ev = be.ebp & 16383;
					be.ebp >>= 14;
					be.enm -=  14;
				  }
				  be.estr += ''+be.edic.charAt(be.ev%91);
				  be.estr += ''+be.edic.charAt(be.ev/91);
				}
			  }
			}
		 
			return this;

  		},
		 encOut: function(){
			 
			var retStr;
			
			if(be.enm > 0){
			  be.estr += ''+be.edic.charAt(be.ebp%91);
			  if(be.enm > 7 || be.ebp > 90)
				be.estr += ''+be.edic.charAt(be.ebp/91);
			}
		 
			retStr = be.estr;
			be.eClear();
			
			return retStr;
		  }
		 ,
		 encode: function(str){
		    return this.encOut(this.buildEncode(str));
		 },
		 buildDecode : function(string){
			 
			var i, x = 0;
			
			while(!isNaN(i = string.charCodeAt(x++))){
			  if(i > 255 || be.ddic[i] == -1)
				continue;
			  if(be.dv == -1)
				be.dv =  be.ddic[i];
			  else{
				be.dv  += be.ddic[i] * 91;
				be.dbp |= (be.dv << be.dnm);
				be.dnm += (be.dv & 8191)>88?13:14;
				do{
				  be.dstr  +=  ''+fromCharCode(be.dbp & 255);
				  be.dbp >>= 8;
				  be.dnm -=  8;
				} while(be.dnm > 7)
				be.dv = -1;
			  }
			}
			
		    return this;
		  },
		  decOut : function(){
			  
			var retStr;
			
			if(be.dv != -1)   
			  be.dstr += ''+fromCharCode((be.dbp | be.dv << be.dnm) & 255);
			retStr = be.dstr;
			be.dClear();
			
			return retStr;
		  },
		  decode:function(str){
			  return this.decOut(this.buildDecode(str));
		  }
 
	  
	}
   
})(window.String.fromCharCode, parseInt);
