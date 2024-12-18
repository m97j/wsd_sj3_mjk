const createCappedCollection = async () => {
    const db = mongoose.connection;
  
    try {
      // 'logs' 컬렉션이 이미 존재하는지 확인
      const collections = await db.db.listCollections({ name: 'logs' }).toArray();
      if (collections.length > 0) {
        console.log('⚠️ Capped collection "logs" already exists.');
        return;
      }
  
      // 'logs' 컬렉션을 고정 크기 컬렉션으로 생성
      await db.createCollection('logs', {
        capped: true,
        size: 25 * 1024 * 1024, // 25MB
        max: 50000, // 최대 50,000개의 문서 (옵션)
      });
      console.log('✅ Created capped collection "logs".');
    } catch (error) {
      console.error('❌ Failed to create capped collection "logs":', error.message);
    }
  };
  
  module.exports = createCappedCollection;
  