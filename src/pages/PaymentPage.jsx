import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import SEOMeta from '../components/common/SEOMeta';
import { ArrowLeft, CreditCard, Info, Lock } from 'lucide-react';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { amount = 500, projectName = 'Projet de démonstration' } = location.state || {};

    return (
        <div className="min-h-screen bg-bg-soft pb-20 pt-28 sm:pt-32">
            <SEOMeta
                title="Paiement — démonstration"
                description="Les paiements ne sont pas activés dans cette démonstration."
                noIndex
            />

            <div className="container max-w-2xl">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-text-soft transition-colors hover:text-blue-700"
                >
                    <ArrowLeft size={18} aria-hidden="true" />
                    Retour
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-3xl border border-border bg-bg-main shadow-card"
                >
                    <div className="border-b border-border bg-bg-soft p-6 sm:p-8">
                        <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                <CreditCard size={21} aria-hidden="true" />
                            </span>
                            <div>
                                <h1 className="font-display text-xl font-bold text-text-main">
                                    Aperçu de paiement
                                </h1>
                                <p className="text-xs text-text-soft">Version démonstration</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <dl className="space-y-3 text-sm">
                            <div className="flex items-center justify-between gap-4">
                                <dt className="text-text-soft">Projet</dt>
                                <dd className="text-right font-semibold text-text-main">{projectName}</dd>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <dt className="text-text-soft">Montant indicatif</dt>
                                <dd className="text-right font-bold text-text-main">
                                    {Number(amount).toLocaleString('fr-FR')} €
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                            <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                            <div>
                                <p className="font-semibold">Paiement non activé</p>
                                <p className="mt-1 text-xs leading-relaxed text-amber-800/80 dark:text-amber-200/80">
                                    Aucun moyen de paiement n’est configuré dans cette démonstration. Aucun débit
                                    ne sera effectué et aucune donnée bancaire ne doit être saisie.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center gap-2 text-xs text-text-soft">
                            <Lock size={14} aria-hidden="true" />
                            Le traitement réel des paiements nécessite un backend sécurisé et un fournisseur
                            configuré.
                        </div>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-primary flex-1"
                            >
                                Retour au tableau de bord
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/messages')}
                                className="btn btn-secondary flex-1"
                            >
                                Contacter un freelance
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentPage;
