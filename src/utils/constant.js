import IconConfig from '@/assets/images/Config.png'
import IconLibrary from '@/assets/images/Library.png'
import IconBuilder from '@/assets/images/Builder.png'
import IconManual from '@/assets/images/Manual.png'
import IconReporting from '@/assets/images/Reporting.png'
// 菜单：链接、图片、标题
export const MENUS = [
  {
    link: 'excursion',
    icon: 'dashboard',
    title: 'Excursion'
  },
  {
    link: 'baseline',
    icon: 'file-image',
    title: 'Baseline Reporting'
  },
  {
    link: 'toolbox',
    icon: 'tool',
    title: 'Toolbox'
  },
  {
    link: 'adc',
    icon: 'robot',
    title: 'AI ADC'
  },
  {
    link: 'setup',
    icon: 'setting',
    title: 'Setup'
  }
]
// ADC入口页 模块列表
export const MODULES = [
  {
    title: 'Manual Classification',
    link: 'manual',
    icon: IconManual
  },
  {
    title: 'Defect Library',
    link: 'library',
    icon: IconLibrary
  },
  {
    title: 'ADC Builder',
    link: 'builder',
    icon: IconBuilder
  },
  {
    title: 'Reporting',
    link: 'reporting',
    icon: IconReporting
  },
  {
    title: 'Mgt & Config',
    link: 'config',
    icon: IconConfig
  }
]
