
// file: src/index.mjs

// Правильный порядок логических групп для METAR/SPECI:
//  1. Тип сводки (METAR/SPECI + COR если есть)
//  2. Код аэродрома (ICAO) (4 буквы)
//  3. Дата и время (день + время UTC с Z в конце)
//  4. Ветер (направление/скорость/порывы + единицы измерения + VRB/CALM если есть)
//  5. Видимость (в метрах или км + направление если есть)
//  6. Погодные явления (если есть: -RA, SN, FG и т.д.)
//  7. Облачность (слои + высота + CB/TCU если есть)
//  8. Температура/Точка росы (TT/TdTd с M для минуса)
//  9. Давление (QNH в гПа)
// 10. Дополнительно (NOSIG, CAVOK, RMK и т.д.)

//      \/ COR       \/ NIL AUTO
// METAR UUEE 141630Z 03012G20MPS 9999 -SN BKN015CB 03/M01 Q1012 NOSIG=
// ↑     ↑    ↑       ↑           ↑    ↑   ↑        ↑      ↑     ↑
// 1     2    3       4           5    6   7        8      9     10

// Особенности:
// - Если CAVOK (видимость ≥10 км, нет облаков ниже 5000ft, нет опасных явлений):
// -- заменяет группы 5, 6, 7
// - Погодные явления могут быть в любом месте после ветра, но обычно перед облачностью.
// - RVR (видимость на ВПП) идёт после основной видимости, если есть.
// @todo

import FormManager         from './core/form_manager.mjs'
import MetarComponents     from './components/metar.mjs'

const form = new FormManager('#amtk_metar_editor')

MetarComponents.type(form)
MetarComponents.icao(form)
MetarComponents.datetime(form)
MetarComponents.nil(form)
MetarComponents.auto(form)
MetarComponents.wind(form)
MetarComponents.cavok(form)
MetarComponents.visibility(form)
MetarComponents.weather(form)
MetarComponents.clouds(form)

MetarComponents.temperature(form)
MetarComponents.pressure(form)
MetarComponents.trend(form)
