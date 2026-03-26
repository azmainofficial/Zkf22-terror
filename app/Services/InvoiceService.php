<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class InvoiceService
{
    /**
     * Store a newly created invoice with its items.
     */
    public function createInvoice(array $data, $attachment = null)
    {
        return DB::transaction(function () use ($data, $attachment) {
            // Handle file upload
            if ($attachment) {
                $filename = time() . '_' . $attachment->getClientOriginalName();
                $path = $attachment->storeAs('invoices', $filename, 'public');
                $data['attachment'] = $path;
            }

            // Create invoice
            $invoice = Invoice::create([
                'client_id' => $data['client_id'],
                'invoice_date' => $data['invoice_date'],
                'due_date' => $data['due_date'],
                'status' => $data['status'],
                'tax_amount' => $data['tax_amount'] ?? 0,
                'discount_amount' => $data['discount_amount'] ?? 0,
                'notes' => $data['notes'] ?? null,
                'terms' => $data['terms'] ?? null,
                'attachment' => $data['attachment'] ?? null,
                'paid_amount' => 0,
                'subtotal' => 0,
                'total_amount' => 0,
                'balance' => 0,
                'is_recurring' => $data['is_recurring'] ?? false,
                'recurring_interval' => $data['recurring_interval'] ?? null,
            ]);

            // Create invoice items
            foreach ($data['items'] as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ]);
            }

            // Fresh instance to get items for calculation
            $invoice->load('items');
            $invoice->calculateTotals();
            $invoice->updateStatus();

            return $invoice;
        });
    }

    /**
     * Update the specified invoice in storage.
     */
    public function updateInvoice(Invoice $invoice, array $data, $attachment = null)
    {
        return DB::transaction(function () use ($invoice, $data, $attachment) {
            // Handle file upload
            if ($attachment) {
                // Delete old file
                if ($invoice->attachment) {
                    Storage::disk('public')->delete($invoice->attachment);
                }

                $filename = time() . '_' . $attachment->getClientOriginalName();
                $path = $attachment->storeAs('invoices', $filename, 'public');
                $data['attachment'] = $path;
            }

            // Update invoice
            $invoice->update([
                'client_id' => $data['client_id'],
                'invoice_date' => $data['invoice_date'],
                'due_date' => $data['due_date'],
                'status' => $data['status'],
                'tax_amount' => $data['tax_amount'] ?? 0,
                'discount_amount' => $data['discount_amount'] ?? 0,
                'notes' => $data['notes'] ?? null,
                'terms' => $data['terms'] ?? null,
                'attachment' => $data['attachment'] ?? $invoice->attachment,
                'is_recurring' => $data['is_recurring'] ?? $invoice->is_recurring,
                'recurring_interval' => $data['recurring_interval'] ?? $invoice->recurring_interval,
            ]);

            // Delete existing items and create new ones
            $invoice->items()->delete();
            foreach ($data['items'] as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ]);
            }

            $invoice->load('items');
            $invoice->calculateTotals();
            $invoice->updateStatus();

            return $invoice;
        });
    }

    /**
     * Remove the specified invoice from storage.
     */
    public function deleteInvoice(Invoice $invoice)
    {
        return DB::transaction(function () use ($invoice) {
            // Delete attachment if exists
            if ($invoice->attachment) {
                Storage::disk('public')->delete($invoice->attachment);
            }

            return $invoice->delete();
        });
    }
}
