import { useContext, useEffect, useState } from "react";
import { CommonStoreContext } from "@/stores/common";
import useTranslation from "next-translate/useTranslation";
import Icon, { ICON_NAMES } from "@/components/icon";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import { TimeNames } from "@/lib/types";
import { HOUR_FORMAT } from "@/lib/const";

export default function TimeSummaryIcon() {
  const { lang } = useTranslation("common");

  const { times, themeColor } = useContext(CommonStoreContext);
  const localTime = times?.localTime || DateTime.local();

  // hicri takvimde akşam ezanı ile tarih bir sonraki güne geçer
  const isAksam =
    times?.today &&
    localTime >=
      DateTime.fromFormat(times?.today[TimeNames.Aksam], HOUR_FORMAT);

  const [showHijriCalendar, setShowHijriCalendar] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHijriCalendar(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!times?.today) return null;

  return (
    <motion.button
      type="button"
      className="flex w-full items-center justify-center"
      onClick={() => setShowHijriCalendar(!showHijriCalendar)}
      animate={showHijriCalendar ? "open" : "closed"}
    >
      <motion.span
        className="absolute"
        variants={{
          open: {
            y: 0,
            opacity: 1,
          },
          closed: {
            y: 10,
            opacity: 0,
          },
        }}
      >
        {localTime
          .reconfigure({ outputCalendar: isAksam ? "islamic" : "islamicc" })
          .toLocaleString(DateTime.DATE_FULL, { locale: lang })}
      </motion.span>

      <motion.span
        variants={{
          close: {
            y: 0,
            opacity: 1,
          },
          open: {
            y: 10,
            opacity: 0,
          },
        }}
      >
        <Icon
          icon={times?.iconName as keyof typeof ICON_NAMES}
          size="1em"
          // size için font-size kullanıyoruz
          className={`text-[44px] md:text-[60px]`}
        />
      </motion.span>
    </motion.button>
  );
}
