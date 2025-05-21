import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const CenteredLoadingIndicator = () => {
  const [showRefreshPageLabel, setShowRefreshPageLabel] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowRefreshPageLabel(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center gap-5 px-4">
        <LoaderCircle className="animate-spin h-13 w-13 text-primary" />
        <AnimatePresence mode="wait" initial={false}>
          {showRefreshPageLabel ? (
            <motion.div
              key="welcome-header"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-semibold">
                Detta tar längre tid än vanligt. Försök ladda om sidan.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CenteredLoadingIndicator;
