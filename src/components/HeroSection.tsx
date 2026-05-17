import Link from 'next/link';
import ContactLink from './ContactLink';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      
      {/* Сложный градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 via-transparent to-primary-600/20" />
      
      {/* Анимированные градиентные пятна */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Текстура */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Контент */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-primary-500/20 border border-orange-400/30 text-orange-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
              <span>🚀</span>
              Подача техники за 2 часа
            </div>
            
            <h1 className="text-white mb-6">
              Аренда спецтехники{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-primary-400">
                в Москве и МО
              </span>
            </h1>
            
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Собственный парк: автовышки до 75 м, краны-манипуляторы, автокраны. 
              Работаем с 2009 года. Все документы. Аттестованные машинисты. Без посредников.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/uslugi" className="btn btn-accent text-base px-8 shadow-glow hover:shadow-glow-lg">
                Выбрать технику
              </Link>
              <ContactLink 
                type="phone" 
                variant="button"
                className="btn bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 text-base px-8"
              />
            </div>
            
            {/* Доверие */}
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-orange-400">✓</span>
                50+ единиц техники
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-400">✓</span>
                Допуск Ростехнадзора
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-400">✓</span>
                Работаем 24/7
              </div>
            </div>
          </div>

          {/* Визуал (справа) */}
          <div className="hidden lg:block relative">
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 border border-white/20 backdrop-blur-sm shadow-2xl">
              {/* Карточки с градиентами */}
              <div className="space-y-4">
                {[
                  { 
                    icon: '/images/icons/icon_avtovyshka.jpg',  // ✅ Путь к картинке
                    iconAlt: 'Автовышка',                        // ✅ Альтернативный текст
                    title: 'Автовышки', 
                    price: 'от 16 000 ₽/смена', 
                    gradient: 'from-orange-500 to-orange-600' 
                  },
                  { 
                    icon: '/images/icons/icon_kmu.jpg', 
                    iconAlt: 'Кран-манипулятор',
                    title: 'Краны-манипуляторы', 
                    price: 'от 20 000 ₽/смена', 
                    gradient: 'from-primary-500 to-primary-600' 
                  },
                  { 
                    icon: '/images/icons/icon_avtokran.jpg', 
                    iconAlt: 'Автокран',
                    title: 'Автокраны', 
                    price: 'от 22 000 ₽/смена', 
                    gradient: 'from-orange-400 to-orange-500' 
                  },
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-white rounded-2xl p-6 shadow-card-hover hover:shadow-glow transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4">
                      {/* ✅ Картинка-иконка вместо эмодзи */}
                      <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg overflow-hidden`}>
                        <Image 
                          src={item.icon}
                          alt={item.iconAlt}
                          width={40}
                          height={40}
                          className="object-contain"
                          sizes="(max-width: 768px) 32px, 64px"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Декоративные элементы */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-500/30 rounded-full blur-2xl" />
          </div>

        </div>
      </div>
    </section>
  );
}