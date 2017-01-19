var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    screen_width = w.innerWidth || e.clientWidth || g.clientWidth,
    screen_height = w.innerHeight|| e.clientHeight|| g.clientHeight;


document.getElementById("canvas").setAttribute("width",screen_width );
document.getElementById("canvas").setAttribute("height",screen_height);
var canvas = Raphael("canvas", screen_width, screen_height);

var music_value = 90;
var news_value = 90;
var comedy_value = 90;
var audiobooks_value = 90;

var music_color = "#C1272D";
var news_color = "#F15A24";
var comedy_color = "#009245";
var audiobooks_color = "#0071BC";

var x_translate  = 150;
var y_translate = window.innerHeight - 100;

var circles =  canvas.set();


canvas.customAttributes.arc = function (xloc, yloc, value, total, R) {
  var alpha = 360 / total * value,
      a = (90 - alpha) * Math.PI / 180,
      x = xloc + R * Math.cos(a),
      y = yloc - R * Math.sin(a),
      path;
  if (total == value) {
    path = [
      ["M", xloc, yloc - R],
      ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
    ];
  } else {
    path = [
      ["M", xloc, yloc - R],
      ["A", R, R, 0, +(alpha > 180), 1, x, y]
    ];
  }
  return {
    path: path
  };
};
canvas.customAttributes.after = function(){

};

Raphael.st.draggable = function() {
  var me = this;
  var originalX,originalY
  var startx, starty;

  var start = function(){
    var bbox = me.getBBox();
    startx = bbox.x  ;
    starty = bbox.y  ;
    originalX = bbox.x + 30;
    originalY = bbox.y + 38 ;
    console.log(this);
  }, move = function(dx, dy){
    me.transform("t" + ( startx + dx ) + "," + (starty + dy));
    if (Raphael.isBBoxIntersect(
            circles.getBBox(),
            me.getBBox()
        )){
      me.startIncreasePercent()
    }
  }, end = function(){
    me.animate({transform: "t"+ originalX+ "," + originalY}, 500, "easeOut");
    me.stopIncreasePercent()
  };
  // rstart and rmove are the resize functions;
  this.drag(move, start, end);
};

var background = canvas.path().attr({
  "stroke": "#063024",
    'opacity': 0,
  "stroke-width": 300,
  arc: [0, 0, 360, 360, 200],
  after: undefined
});
background.translate(x_translate,y_translate);


/**
 * Music
 */
var music = canvas.path().attr({
  "stroke": music_color,
  "stroke-width": 400,
  'stroke-opacity': 0.7,
  arc: [0, 0, 0, 360, 200]
});
music.translate(x_translate,y_translate);

circles.push(music);
music.animate({
  arc: [0, 0, music_value, 360, 200],
}, 1500, "bounce");

/**
 * News
 */
var news  = canvas.path().attr({
  "stroke": news_color,
  "stroke-width": 400,
  'stroke-opacity': 0.7,
  arc: [0, 0, 0, 360, 200],
});
circles.push(news);
news.translate(x_translate,y_translate);
news.rotate(music_value,0,0)

news.animate({
  arc: [0, 0, news_value, 360, 200]
}, 1500, "bounce");


/**
 * Comedy
 */
var comedy  = canvas.path().attr({
  "stroke": comedy_color,
  "stroke-width": 400,
  'stroke-opacity': 0.7,
  arc: [0, 0, 0, 360, 200],
});
circles.push(comedy);
comedy.translate(x_translate,y_translate);
comedy.rotate(music_value + news_value,0,0)

comedy.animate({
  arc: [0, 0, comedy_value, 360, 200]
}, 1500, "bounce");


/**
 * Audiobooks
 */
var audiobooks  = canvas.path().attr({
  "stroke": audiobooks_color,
  "stroke-width": 400,
  'stroke-opacity': 0.7,
  arc: [0, 0, 0, 360, 100],
});
circles.push(audiobooks);
audiobooks.translate(x_translate,y_translate);
audiobooks.rotate(comedy_value + music_value + news_value,0,0)

audiobooks.animate({
  arc: [0, 0, audiobooks_value, 360, 200]
}, 1500, "bounce");





music.attr({
  after: news
});
news.attr({
  after: comedy
});
comedy.attr({
  after: audiobooks
});
audiobooks.attr({
  after: music
});



function increasePercent(start_circle) {
  if(start_circle.attrs.arc[2]<=359){
  start_circle.attr({
    arc: [0, 0, start_circle.attrs.arc[2]+1, 360, 200]
  });}
  var number_of_peaces = circles.length-1;
  circles.forEach(function (circle) {
    if (circle.attrs.arc[2] <= 0) {
      number_of_peaces = number_of_peaces -1
    }
  })

  var factor_decrease = 1 / number_of_peaces;
  var i = number_of_peaces;
  var total_amount_circle = start_circle.attrs.after.attrs.arc[2]+start_circle.attrs.after.attrs.after.attrs.arc[2]+start_circle.attrs.after.attrs.after.attrs.after.attrs.arc[2];
  var factor_decrease_percentage;
  var rotate_factor = 1;

  var circle = start_circle;
  while (i>0){
    circle = circle.attrs.after;
    factor_decrease_percentage = circle.attrs.arc[2]/total_amount_circle;
    if (circle.attrs.arc[2] > 0){
      circle.attr({
        arc: [0, 0, circle.attrs.arc[2]-factor_decrease_percentage, 360, 200]
      });
    }
    circle.rotate(rotate_factor,0,0);
    i--
      rotate_factor -= factor_decrease_percentage;
  }


}
/**
 * Buttons
 *
 */

var width = 120;
var height = 120;

function createButton(src, start_circle, color) {
  var globalIdAnimationFrame = null;
  group  = canvas.set();

  img = canvas.image(src, 0,0,width,height);
  bbox = img.getBBox();
  circle = canvas.circle(bbox.x + bbox.width/2,bbox.y + bbox.height/2,bbox.height/2 + width*0.3);
  circle.attr({
    fill: color,
    'fill-opacity': 0.5,
      'stroke': '#FFFFFF',
      'stroke-width': 2
  });
  img.toFront();



  group.push(img);
  group.push(circle );
  group.startIncreasePercent = function () {
    if (globalIdAnimationFrame){
      window.cancelAnimationFrame(globalIdAnimationFrame)
    }
    function repeat() {
      globalIdAnimationFrame = window.requestAnimationFrame(repeat);
      increasePercent(start_circle)
    }
    globalIdAnimationFrame = window.requestAnimationFrame(repeat)
  };
  group.stopIncreasePercent = function(){
    if (globalIdAnimationFrame){
      window.cancelAnimationFrame(globalIdAnimationFrame)
    }
  };

  group.draggable();

  return group;
}

var musicIcon = createButton("./src/music-icon.svg", music, music_color);
var news = createButton("./src/newspaper-icon.svg", news, news_color);
var audiobooks  = createButton("./src/audiobook-icon.svg", audiobooks, audiobooks_color);
var comedy  = createButton("./src/theater-masks-icon.svg", comedy, comedy_color);

var translate_button_x = screen_width - 200;
musicIcon.translate(translate_button_x,100);
news.translate(translate_button_x,300);
audiobooks.translate(translate_button_x,500);
comedy.translate(translate_button_x,700);

var velocity = 0;
var drag = function (dx,dy) {
  velocity = Math.abs(dx+dy) / (screen_width+screen_height);
  var factor = velocity * 15;
  if ((dx + dy) < 0 ){
    factor = factor * -1;
  }
  requestAnimationFrame(function(){circles.rotate(factor, 0,0)});

};
var start = function(){

};
var end = function(){


};
circles.drag(drag, start, end);