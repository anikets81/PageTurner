import { BsEnvelopeOpenHeart } from "react-icons/bs";
import { SiOnlyfans } from "react-icons/si";
// prettier-ignore
import {GiCastle,  GiCupidonArrow,  GiGhost, GiMeditation, GiRingedPlanet, GiScrollUnfurled, GiSpellBook,  GiSpy,  GiSwordsEmblem,  GiTreasureMap,} from "react-icons/gi";

export const categories = [
  { id: 2, name: "Adventure", iconSrc: <GiTreasureMap fontSize={30} /> },
  { id: 3, name: "Fantasy", iconSrc: <GiCastle fontSize={30} /> },
  { id: 4, name: "Fiction", iconSrc: <GiSpellBook fontSize={30} /> },
  { id: 5, name: "Horror", iconSrc: <GiGhost fontSize={30} /> },
  { id: 6, name: "Mystery", iconSrc: <GiSpy fontSize={30} /> },
  { id: 7, name: "Poetry", iconSrc: <BsEnvelopeOpenHeart fontSize={30} /> },
  { id: 8, name: "Romance", iconSrc: <GiCupidonArrow fontSize={30} /> },
  { id: 9, name: "Scifi", iconSrc: <GiRingedPlanet fontSize={30} /> },
  { id: 10, name: "Historical", iconSrc: <GiScrollUnfurled fontSize={30} /> },
  { id: 11, name: "Fan-Fiction", iconSrc: <SiOnlyfans fontSize={30} /> },
  { id: 12, name: "Spiritual", iconSrc: <GiMeditation fontSize={30} /> },
];
