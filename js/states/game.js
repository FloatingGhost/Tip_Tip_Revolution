var gamestate = function() {};

gamestate.prototype = {

  init: function() {},

  preload: function() {
    game.load.image("neckbeard", "res/img/neckbeard_base.png");
    game.load.image("fedora", "res/img/fedora.png");
    game.load.audio("eternal", "res/snd/I-Am-Eternal.mp3");
    game.load.audio("hey", "res/snd/hey.mp3");
    game.load.script('soundAnalysePlugin', 'js/lib/SoundAnalyse.js');
    game.load.image("pulse", "res/img/pulser.png");
    game.load.script('filter', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/Marble.js'); 
  },

  create: function() {
    this.neck = game.add.sprite(0,0,"neckbeard");
    this.song = game.add.audio("hey",0.6);
    this.tiptimer = 0;
    this.tipmax = 25;
    
    this.fedora = game.add.sprite(365,0,"fedora");
    this.fedora.anchor = {x:1, y:0};
    this.pulser=game.add.group()
    for (i = 0; i < 100; i++) {
      this.pulser.create(Math.random()*718, Math.random()*404, "pulse");
    }
    for (i in this.pulser.children) {
      this.pulser.children[i].anchor = {x:Math.random(), y:Math.random()};
      this.pulser.children[i].alpha = 0.1;
      this.pulser.children[i].tint = Math.random()*0xffffff; 
    }    

    var soundAnalyse = game.plugins.add(new Phaser.Plugin.SoundAnalyse(game));
    this.tipper = soundAnalyse.add.soundAnalyseSprite(game.world.centerX,game.world.centerY,816,504,"eternal");
    this.tipper.volume = 0.5;
    this.tipper.alpha = 0.4;
   
    this.tipper.bmpAnalyseTexture.backgroundAlpha = 0;
    this.tipper.anchor = {x:0.5, y:0.5}
    this.tipper.play();
    this.lastavg = 0;
    this.avg = 0;
    this.index = 0;
    this.cols = [0xff0000, 0x551122, 0x00ff00, 0x0000ff];
    
  },

  tip: function() {
    if (this.tiptimer == 0) {
      console.log("TIP");
      var i = game.add.tween(this.fedora).to({rotation: this.fedora.rotation-(3.14/16)}, 30);
      var j = game.add.tween(this.fedora).to({rotation: 0},30);
      i.chain(j);
      i.start();
      
      this.neck.tint = Math.random()*0xffffff;
      this.fedora.tint = Math.random()*0xffffff;
      this.tipper.tint = Math.random()*0xffffff;
      if (Math.random()>0.9)
        game.add.tween(this.tipper).to({rotation: this.tipper.rotation+3.14}, 1).start()  
      for (i in this.pulser.children) {
        this.pulser.children[i].tint = Math.random()*0xffffff;
        game.add.tween(this.pulser.children[i]).to({x:718*Math.random(), y:404*Math.random()}, 100+(200*Math.random())).start();
      }
    this.tiptimer = this.tipmax;
  }
  },

  threshold: function(arr) {
    var THRESH = 120;
    for (i in arr) {
      if (arr[i] < THRESH) arr[i] = 0;
      arr[i] *= 3;
    }
    return arr
  },

  update: function() {
    if (this.tiptimer > 0) this.tiptimer-=1;
    if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
      this.tip();
    }
    var diff = 0;
    try{
    var a = this.tipper.songAnalyse.getAvg(this.threshold(this.tipper.songAnalyse._dataArray)) / 20
    for (i in this.pulser.children) {
       var b = Math.abs(Math.random()*0.1)+1
       var d = Math.abs(Math.random()*0.1)+1
       var e = (i%2!=0)?-1:1; 
       var c = 0.1
        this.pulser.children[i].scale.set(e*a*b*c,e*a*d*c);
    }
    diff = a - this.lastavg;
    this.lastavg = this.avg;
    this.avg = a;
   
    
    } catch (e) {}
    if ((diff) > 0.2) {
      this.tip();
    }
  },

}
