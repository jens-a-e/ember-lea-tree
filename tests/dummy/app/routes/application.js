import Ember from 'ember';
import DS from 'ember-data';

let TreeNode = Ember.Object.extend({
  type: "tree-leaf",
  time: Date.now(),
  name: "",
  _startTimer: function(){
    self = this;
    Ember.run.scheduleOnce('afterRender',this, function(){
      Ember.run.later(this,function(){
        this.set('time', Date.now());
      });
    });
  }.on('init').observes('time')
});

let TreeBranch = TreeNode.extend({
  type: "tree-branch",
  children: function(){
    var self = this;
    return DS.PromiseArray.create({
      promise: new Promise(function(resolve,reject){
        self.set('resolveChildren',resolve);
        self.set('rejectChildren',reject);
      })
    });
  }.property(),
  resolveChildren: function(){},
  rejectChildren: function(){},
  populate: function(){
    Ember.run.scheduleOnce('afterRender',this,function(){
      var self = this;
      Ember.run.later(this,function(){
        self.set('_content',self.get('with'));
        Ember.run.scheduleOnce('afterRender',self,function(){
          self.get('resolveChildren')(self.get('with'));
        });
      });
    });
  }.on('init').observes('with','resolveChildren')
});

export default Ember.Route.extend({
  model:function () {
    var one = [
      TreeNode.create(),
      TreeBranch.create({
        with: [
            TreeNode.create(),
            TreeBranch.create({
              with: [
                TreeNode.create(),
                TreeNode.create()
              ]
            })
          ]
      })
    ];
    var data = Ember.A()
    for (var i=0; i< 20; i++) {
      data.push(TreeBranch.create({with: one}));
    }
    return data;
  }
});
