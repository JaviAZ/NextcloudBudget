<?php

declare(strict_types=1);

namespace OCA\Budget\Tests\Unit\Migration;

use OCA\Budget\Migration\Version001000104Date20260916;
use PHPUnit\Framework\TestCase;

/**
 * The date a one-time bill from before 2.49.0 was due, recovered from what
 * its row still holds (#333).
 */
class OneTimeDueDateBackfillTest extends TestCase {

	public function testAnUnpaidBillsDateIsItsNextDueDate(): void {
		$this->assertSame('2026-10-01', Version001000104Date20260916::dueDateFor(null, 10, '2026-10-01', null));
		$this->assertSame('2026-09-30', Version001000104Date20260916::dueDateFor(30, 9, '2026-09-30 00:00:00', null));
	}

	public function testAPaidBillTakesTheYearNearestToItsPaymentDate(): void {
		// paid the day before it was due
		$this->assertSame('2026-08-31', Version001000104Date20260916::dueDateFor(31, 8, null, '2026-08-30'));
		// paid two days late, across the month end
		$this->assertSame('2026-03-30', Version001000104Date20260916::dueDateFor(30, 3, null, '2026-04-01'));
		// due in December, paid in the new year: the previous year is nearer
		$this->assertSame('2026-12-15', Version001000104Date20260916::dueDateFor(15, 12, null, '2027-01-03'));
		// due in January, paid early in December: next year is nearer
		$this->assertSame('2027-01-05', Version001000104Date20260916::dueDateFor(5, 1, null, '2026-12-20'));
	}

	public function testADayTheMonthDoesNotHaveIsClampedToItsLastDay(): void {
		$this->assertSame('2026-02-28', Version001000104Date20260916::dueDateFor(30, 2, null, '2026-02-28'));
		$this->assertSame('2026-10-01', Version001000104Date20260916::dueDateFor(null, 10, null, '2026-10-03'));
	}

	public function testNothingToGoOnGivesNothing(): void {
		$this->assertNull(Version001000104Date20260916::dueDateFor(5, null, null, '2026-01-01'), 'no month');
		$this->assertNull(Version001000104Date20260916::dueDateFor(5, 5, null, null), 'never paid, no next due date');
		$this->assertNull(Version001000104Date20260916::dueDateFor(5, 13, null, '2026-01-01'), 'month out of range');
	}
}
