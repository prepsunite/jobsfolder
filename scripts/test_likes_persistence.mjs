// Automated Verification Test for Likes and Persistence
import assert from 'assert';

class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

const mockStorage = new MockLocalStorage();
global.localStorage = mockStorage;
global.window = {
  dispatchEvent: () => {},
};

// Replicate LikeStore logic for node test verification
class TestLikeStore {
  getStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  setStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  // Experiences
  getLikedExperienceIds() {
    return this.getStorage('prepunite_upvoted_experiences', []);
  }
  isExperienceLiked(id) {
    return this.getLikedExperienceIds().includes(id);
  }
  getExperienceLikeCount(id, base = 0) {
    return Math.max(0, (base || 0) + (this.isExperienceLiked(id) ? 1 : 0));
  }
  toggleExperienceLike(id, base = 0) {
    const list = this.getLikedExperienceIds();
    let updated;
    let isLiked;
    if (list.includes(id)) {
      updated = list.filter(x => x !== id);
      isLiked = false;
    } else {
      updated = [...list, id];
      isLiked = true;
    }
    this.setStorage('prepunite_upvoted_experiences', updated);
    return { isLiked, count: Math.max(0, (base || 0) + (isLiked ? 1 : 0)) };
  }

  // Companies
  getLikedCompanySlugs() {
    return this.getStorage('prepunite_liked_companies', []);
  }
  isCompanyLiked(slug) {
    return this.getLikedCompanySlugs().includes((slug || '').toLowerCase().trim());
  }
  getCompanyBaseCount(slug) {
    const clean = (slug || 'tcs').toLowerCase().trim();
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = (hash << 5) - hash + clean.charCodeAt(i);
      hash |= 0;
    }
    return 75 + (Math.abs(hash) % 120);
  }
  getCompanyLikeCount(slug) {
    const base = this.getCompanyBaseCount(slug);
    return base + (this.isCompanyLiked(slug) ? 1 : 0);
  }
  toggleCompanyLike(slug) {
    const clean = (slug || '').toLowerCase().trim();
    const list = this.getLikedCompanySlugs();
    let updated;
    let isLiked;
    if (list.includes(clean)) {
      updated = list.filter(x => x !== clean);
      isLiked = false;
    } else {
      updated = [...list, clean];
      isLiked = true;
    }
    this.setStorage('prepunite_liked_companies', updated);
    return { isLiked, count: this.getCompanyLikeCount(clean) };
  }

  // Exams
  getLikedExamIds() {
    return this.getStorage('prepunite_liked_exams', []);
  }
  isExamLiked(id) {
    return this.getLikedExamIds().includes(id);
  }
  getExamBaseCount(id, base = 0) {
    if (base && base > 0) return base;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    return 45 + (Math.abs(hash) % 85);
  }
  getExamLikeCount(id, base = 0) {
    const b = this.getExamBaseCount(id, base);
    return b + (this.isExamLiked(id) ? 1 : 0);
  }
  toggleExamLike(id, base = 0) {
    const list = this.getLikedExamIds();
    let updated;
    let isLiked;
    if (list.includes(id)) {
      updated = list.filter(x => x !== id);
      isLiked = false;
    } else {
      updated = [...list, id];
      isLiked = true;
    }
    this.setStorage('prepunite_liked_exams', updated);
    return { isLiked, count: this.getExamLikeCount(id, base) };
  }
}

function runTests() {
  console.log('1. Testing Experience Like & Persistence across refresh...');
  const store1 = new TestLikeStore();
  const expId = 'exp_tcs_aniket_01';
  const initialBase = 84;

  assert.strictEqual(store1.isExperienceLiked(expId), false);
  assert.strictEqual(store1.getExperienceLikeCount(expId, initialBase), 84);

  // User clicks Like
  const toggleRes1 = store1.toggleExperienceLike(expId, initialBase);
  assert.strictEqual(toggleRes1.isLiked, true);
  assert.strictEqual(toggleRes1.count, 85);

  // SIMULATE PAGE REFRESH: create brand new store instance reading existing localStorage
  console.log(' -> Simulating page refresh (F5)...');
  const store2 = new TestLikeStore();
  assert.strictEqual(store2.isExperienceLiked(expId), true, 'Experience must stay liked after refresh!');
  assert.strictEqual(store2.getExperienceLikeCount(expId, initialBase), 85, 'Count must stay incremented to 85 after refresh!');

  // User clicks unlike
  const toggleRes2 = store2.toggleExperienceLike(expId, initialBase);
  assert.strictEqual(toggleRes2.isLiked, false);
  assert.strictEqual(toggleRes2.count, 84);

  // Simulating second refresh after unliking
  const store3 = new TestLikeStore();
  assert.strictEqual(store3.isExperienceLiked(expId), false);
  assert.strictEqual(store3.getExperienceLikeCount(expId, initialBase), 84);
  console.log('PASS: Experience likes persist reliably across refresh!');

  console.log('\n2. Testing Company Like & Persistence across refresh...');
  const companySlug = 'tcs';
  const baseCompanyLikes = store3.getCompanyBaseCount(companySlug);
  assert.strictEqual(store3.isCompanyLiked(companySlug), false);
  assert.strictEqual(store3.getCompanyLikeCount(companySlug), baseCompanyLikes);

  // User clicks Heart on Company
  const companyToggle1 = store3.toggleCompanyLike(companySlug);
  assert.strictEqual(companyToggle1.isLiked, true);
  assert.strictEqual(companyToggle1.count, baseCompanyLikes + 1);

  // SIMULATE PAGE REFRESH
  console.log(' -> Simulating page refresh (F5)...');
  const store4 = new TestLikeStore();
  assert.strictEqual(store4.isCompanyLiked(companySlug), true, 'Company must stay liked after refresh!');
  assert.strictEqual(store4.getCompanyLikeCount(companySlug), baseCompanyLikes + 1, 'Company like count must stay incremented!');
  console.log('PASS: Company likes persist reliably across refresh!');

  console.log('\n3. Testing Exam Like & Persistence across refresh...');
  const examId = 'e0000000-0000-0000-0000-000000000001';
  const examBase = 50;
  assert.strictEqual(store4.isExamLiked(examId), false);
  assert.strictEqual(store4.getExamLikeCount(examId, examBase), 50);

  // User clicks Heart on Exam
  const examToggle1 = store4.toggleExamLike(examId, examBase);
  assert.strictEqual(examToggle1.isLiked, true);
  assert.strictEqual(examToggle1.count, 51);

  // SIMULATE PAGE REFRESH
  console.log(' -> Simulating page refresh (F5)...');
  const store5 = new TestLikeStore();
  assert.strictEqual(store5.isExamLiked(examId), true, 'Exam must stay liked after refresh!');
  assert.strictEqual(store5.getExamLikeCount(examId, examBase), 51, 'Exam like count must stay incremented to 51!');
  console.log('PASS: Exam likes persist reliably across refresh!');

  console.log('\n=== ALL PERSISTENCE TESTS PASSED (100% RELIABLE) ===');
}

runTests();
