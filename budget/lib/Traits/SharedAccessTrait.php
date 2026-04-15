<?php

declare(strict_types=1);

namespace OCA\Budget\Traits;

use OCA\Budget\Exception\ReadOnlyShareException;
use OCA\Budget\Service\GranularShareService;

/**
 * Trait for controllers that support granular budget sharing.
 *
 * Provides convenience methods to get visible entity IDs and check
 * write permissions. Controllers use these instead of raw userId scoping.
 *
 * Controllers using this trait must:
 * 1. Have a `$userId` property (the authenticated Nextcloud user)
 * 2. Inject GranularShareService and call `setGranularShareService()` in constructor
 */
trait SharedAccessTrait {
    protected ?GranularShareService $granularShareService = null;

    protected function setGranularShareService(GranularShareService $service): void {
        $this->granularShareService = $service;
    }

    /**
     * Returns the authenticated user's own ID.
     * Kept for backward compatibility — no longer swaps to another user.
     */
    protected function getEffectiveUserId(): string {
        return $this->userId;
    }

    /** @return int[] */
    protected function getVisibleAccountIds(): array {
        return $this->granularShareService->getVisibleAccountIds($this->userId);
    }

    /** @return int[] */
    protected function getVisibleCategoryIds(): array {
        return $this->granularShareService->getVisibleCategoryIds($this->userId);
    }

    /** @return int[] */
    protected function getVisibleBillIds(): array {
        return $this->granularShareService->getVisibleBillIds($this->userId);
    }

    /** @return int[] */
    protected function getVisibleRecurringIncomeIds(): array {
        return $this->granularShareService->getVisibleRecurringIncomeIds($this->userId);
    }

    /** @return int[] */
    protected function getVisibleSavingsGoalIds(): array {
        return $this->granularShareService->getVisibleSavingsGoalIds($this->userId);
    }

    /**
     * Check write permission. Throws ReadOnlyShareException if denied.
     */
    protected function requireWriteAccess(string $entityType, int $entityId): void {
        $this->granularShareService->requireWriteAccess($this->userId, $entityType, $entityId);
    }

    /**
     * Check if user can access a specific entity.
     */
    protected function canAccessEntity(string $entityType, int $entityId): bool {
        return $this->granularShareService->canAccess($this->userId, $entityType, $entityId);
    }
}
