import { Building2, Clock, HandCoins, Mail, MapPin, Phone } from 'lucide-react'

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
          <div className="space-y-6 reveal-left">
            {/* Endereço */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0 text-burgundy">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-burgundy mb-1">Endereço</h4>
                <p className="text-sm text-text-soft">Praça São José, s/n</p>
                <p className="text-sm text-text-soft">Centro, São José de Ribamar – MA</p>
                <p className="text-sm text-text-soft">CEP: 65110-000</p>
              </div>
            </div>

            {/* Secretaria */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0 text-burgundy">
                <Clock size={18} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-burgundy mb-1">Secretaria — Horários</h4>
                <p className="text-sm text-text-soft">Ter. a Sáb.: 8h às 12h · 14h às 18h</p>
                <p className="text-sm text-text-soft">Domingo: 8h às 10h</p>
              </div>
            </div>

            {/* Centro Pastoral */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0 text-burgundy">
                <Building2 size={18} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-burgundy mb-1">Centro Pastoral — Horários</h4>
                <p className="text-sm text-text-soft">Ter. a Sáb.: 8h às 12h · 14h às 19h</p>
                <p className="text-sm text-text-soft">Domingo: 7h às 12h30 · 14h às 19h</p>
              </div>
            </div>

            {/* Telefone */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0 text-burgundy">
                <Phone size={18} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-burgundy mb-1">Telefones</h4>
                <p className="text-sm text-text-soft">(98) 3224-1147</p>
                <p className="text-sm text-text-soft">(98) 9 8911-4019</p>
              </div>
            </div>

            {/* E-mail */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0 text-burgundy">
                <Mail size={18} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-burgundy mb-1">E-mail</h4>
                <a
                  href="mailto:santuariosjrsecretaria@hotmail.com"
                  className="text-sm text-gold hover:text-gold-light transition-colors break-all"
                >
                  santuariosjrsecretaria@hotmail.com
                </a>
              </div>
            </div>

            {/* Pix */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0 text-burgundy">
                <HandCoins size={18} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-burgundy mb-1">Pix para Doações</h4>
                <p className="text-sm text-text-soft">(98) 98893-0158</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 reveal rounded-xl overflow-hidden shadow-md min-h-[300px]">
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
        </div>
      </div>
    </section>
  )
}
