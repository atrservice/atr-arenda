import { Metadata } from 'next';
import Link from 'next/link';
import { CONTACTS } from '@/lib/contacts';

export const metadata: Metadata = {
  title: 'Реквизиты компании | АТР-СЕРВИС',
  description: 'Реквизиты ООО «АТР-СЕРВИС» для заключения договоров и оплаты услуг аренды спецтехники.',
};

export default function RekvizityPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <nav className="bg-gray-50 py-3 border-b mb-8">
        <ol className="flex gap-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:text-primary-600">Главная</Link></li>
          <li className="text-gray-400">/</li>
          <li className="font-medium text-gray-900">Реквизиты</li>
        </ol>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-8">Реквизиты компании</h1>
      
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <table className="w-full">
          <tbody>
            {[
              ['Полное наименование', 'Общество с ограниченной ответственностью «АТР-СЕРВИС»'],
              ['Сокращённое наименование', 'ООО «АТР-СЕРВИС»'],
              ['ИНН', '7733700905'],
              ['КПП', '771301001'],
              ['ОГРН', '1097746299991'],
              ['Юридический адрес', CONTACTS.address],
              ['Расчётный счёт', '40702810410001952028'],
              ['Банк', 'АО «ТБанк», г. Москва, ул. Хуторская 2-я, д. 38А, стр. 26'],
              ['БИК', '044525974'],
              ['Корр. счёт', '30101810145250000974'],
              ['Телефон', CONTACTS.phone.formatted],
              ['Email', CONTACTS.email.address],
            ].map(([label, value], idx) => (
              <tr key={idx} className="border-b border-gray-100 last:border-0">
                <td className="py-3 pr-4 font-semibold text-gray-700 align-top w-1/3">{label}</td>
                <td className="py-3 text-gray-900">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <h2 className="text-xl font-bold mb-2 text-blue-900">Для заключения договора</h2>
        <p className="text-blue-800">
          Отправьте реквизиты вашей компании на email{' '}
          <a href={CONTACTS.email.link} className="font-semibold underline">
            {CONTACTS.email.address}
          </a>{' '}
          или позвоните по телефону {CONTACTS.phone.formatted}. 
          Мы подготовим договор в течение 1 рабочего дня.
        </p>
      </div>
    </div>
  );
}