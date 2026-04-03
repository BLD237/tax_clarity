import { buildTaxReportPdf, downloadPdfBlob, sharePdfIfSupported } from '../features/pdf/buildReport.js'
import { Button } from './ui/Button.jsx'
import { Card } from './ui/Card.jsx'

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {Parameters<typeof buildTaxReportPdf>[0]} props.payload
 */
export function PdfExportDialog({ open, onClose, payload }) {
  if (!open) return null

  async function handleDownload() {
    const bytes = await buildTaxReportPdf(payload)
    downloadPdfBlob(bytes)
  }

  async function handleShare() {
    const bytes = await buildTaxReportPdf(payload)
    const ok = await sharePdfIfSupported(bytes, 'taxclarity-report.pdf')
    if (!ok) downloadPdfBlob(bytes)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center dark:bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-dialog-title"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <Card className="relative !p-6">
          <h2 id="pdf-dialog-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Export PDF report
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Download to your device or use your browser share sheet when available.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button type="button" variant="secondary" onClick={handleDownload}>
              Download
            </Button>
            <Button type="button" onClick={handleShare}>
              Share
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
