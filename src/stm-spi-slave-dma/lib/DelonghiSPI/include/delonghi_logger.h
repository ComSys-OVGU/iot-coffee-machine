/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef __DELONGHI_LOGGER_H
#define __DELONGHI_LOGGER_H

#include <stdbool.h>
#include <stdint.h>

void DLL_Log(void);
void DLL_Poll(void);
void DLL_Set_Debug(bool fle);
void DLL_Set_LCD_Enabled(bool lcd);
void DLL_Set_PB_Enabled(bool pb);

#endif /* __DELONGHI_LOGGER_H */
