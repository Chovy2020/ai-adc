// Module Component
import Classification from '@/pages/Classification/Loadable'
import Library from '@/pages/Library/Loadable'
import Builder from '@/pages/Builder/Loadable'
import Reporting from '@/pages/Reporting/Loadable'
import Manage from '@/pages/Manage/Loadable'
import Config from '@/pages/Config/Loadable'

// Module Icon
import IconClassification from '@/assets/images/Classification.png'
import IconLibrary from '@/assets/images/Library.png'
import IconBuilder from '@/assets/images/Builder.png'
import IconReporting from '@/assets/images/Reporting.png'
import IconManage from '@/assets/images/Manage.png'
import IconConfig from '@/assets/images/Config.png'

// Module Route
export const MODULES = [
  {
    title: 'Manual Classification',
    link: '/classification',
    icon: IconClassification,
    page: Classification
  },
  {
    title: 'Defect Library',
    link: '/library',
    icon: IconLibrary,
    page: Library
  },
  {
    title: 'ADC Builder',
    link: '/builder',
    icon: IconBuilder,
    page: Builder
  },
  {
    title: 'Reporting',
    link: '/reporting',
    icon: IconReporting,
    page: Reporting
  },
  {
    title: 'Management',
    link: '/manage',
    icon: IconManage,
    page: Manage
  },
  {
    title: 'Config',
    link: '/config',
    icon: IconConfig,
    page: Config
  }
]
