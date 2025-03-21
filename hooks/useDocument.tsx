import { useEffect, useState } from 'react';

const useDocument = () => {
  const [document, setDocument] = useState<
    HTMLDocument | Document | undefined | null
  >(null);

  useEffect(() => {
    const DOCUMENT = window?.document;

    if (DOCUMENT) {
      setDocument(DOCUMENT);
    }

    return () => {
      setDocument(null);
    };
  }, []);

  return { document };
};

export default useDocument;
