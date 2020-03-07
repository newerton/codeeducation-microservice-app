import toast from '~/util/toast';

const useCollectionManager = (collection, setCollection) => {
  return {
    addItem(item) {
      if (!item || item === '') {
        return;
      }
      const exists = collection.find(i => i.id === item.id);
      if (exists) {
        toast.info('Item já adicionado');
        return;
      }

      setCollection([...collection, item]);
    },
    removeItem(item) {
      const index = collection.findIndex(i => i.id === item.id);
      if (index === -1) {
        return;
      }
      collection.splice(index, 1);
      setCollection(collection.filter(i => i.id !== item.id));
    },
  };
};

export default useCollectionManager;
