import { expandTopicAliases } from '../frontend/src/services/topicMap.js';

const testTopics = [
  'stage-1-two-pointers',
  'stage-2-sliding-window',
  'stage-3-linked-lists',
  'stage-4-stacks-queues',
  'stage-5-binary-search',
  'stage-6-trees-bst',
  'stage-7-heaps',
  'stage-8-backtracking',
  'stage-9-dp-classics',
  'stage-10-graphs',
  'arrays-fundamentals',
  'patterns',
  'TWO_POINTERS',
  'SLIDING_WINDOW',
  'TREES_BINARY_TREES',
  'DYNAMIC_PROGRAMMING',
  'LINKED_LISTS',
  'STACKS_QUEUES',
  'GRAPHS'
];

console.log('Testing topic expansion for coding topics:');
testTopics.forEach(t => {
  const expanded = expandTopicAliases([t]);
  console.log(`\nTopic: "${t}"`);
  console.log(`  Expanded:`, expanded);
});
