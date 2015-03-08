import Ember from 'ember';
import TreeNode from './tree-node';

export default TreeNode.extend({
  tagName: "li",
  classNames: ["tree-leaf"],
  draggable: true
})
