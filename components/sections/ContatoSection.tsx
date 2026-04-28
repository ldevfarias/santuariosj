import { MapPin, Phone, Mail, Clock } from 'lucide-react'

import ContatoForm from '../interactive/ContatoForm'
import SectionHeader from '../ui/SectionHeader'

export default function ContatoSection() {
  return (
    <section id="contato" className="py-20 bg-cream">
      <div className="container-site">
        <SectionHeader
          title="Entre em Contato"
          subtitle="Estamos aqui para servi-lo"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-6">
            {[
              {
                icon: MapPin,
                title: 'Endereço',
                lines: ['Praça São José, s/n', 'Centro, São José de Ribamar – MA', 'CEP: 65110-000'],
              },
              {
                icon: Phone,
                title: 'Telefone',
                lines: ['(98) 3227-0000', '(98) 9 9999-9999'],
              },
              {
                icon: Mail,
                title: 'E-mail',
                lines: ['contato@santuariosjoser.org.br'],
              },
              {
                icon: Clock,
                title: 'Secretaria',
                lines: [
                  'Segunda a Sexta: 08h00 às 12h00',
                  'e 14h00 às 18h00',
                  'Sábado: 08h00 às 12h00',
                ],
              },
            ].map(({ icon: Icon, title, lines }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0 text-burgundy">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-burgundy mb-1">{title}</h4>
                  {lines.map((line) => (
                    <p key={line} className="text-sm text-text-soft">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="rounded-xl overflow-hidden shadow-md min-h-[300px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31820.476!2d-44.0588!3d-2.5655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7f68ce2a57b4e49%3A0x6b8a6b8a6b8a6b8a!2sSão%20José%20de%20Ribamar%2C%20MA!5e0!3m2!1spt!2sbr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do Santuário"
            />
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl p-8 shadow-md">
            <ContatoForm />
          </div>
        </div>
      </div>
    </section>
  )
}
