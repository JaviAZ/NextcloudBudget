<?php

declare(strict_types=1);

namespace OCA\Budget\Tests\Unit\Traits;

use OCA\Budget\Service\ValidationService;
use OCA\Budget\Traits\InputValidationTrait;
use OCP\AppFramework\Http;
use PHPUnit\Framework\TestCase;

/**
 * Test the InputValidationTrait via a concrete test class that uses it.
 */
class InputValidationTraitTest extends TestCase {
	private InputValidationTraitTestClass $subject;
	private ValidationService $validator;

	protected function setUp(): void {
		$this->validator = $this->createMock(ValidationService::class);
		$this->subject = new InputValidationTraitTestClass();
		$this->subject->callSetInputValidator($this->validator);
	}

	// ── getInputValidator / setInputValidator ───────────────────────

	public function testSetAndGetInputValidator(): void {
		$this->assertSame($this->validator, $this->subject->callGetInputValidator());
	}

	public function testGetInputValidatorCreatesDefaultWhenNotSet(): void {
		$fresh = new InputValidationTraitTestClass();
		$result = $fresh->callGetInputValidator();
		$this->assertInstanceOf(ValidationService::class, $result);
	}

	// ── validateInputs ─────────────────────────────────────────────

	public function testValidateInputsAllValid(): void {
		$this->validator->method('validateName')
			->willReturn(['valid' => true, 'sanitized' => 'Clean Name']);
		$this->validator->method('validateDescription')
			->willReturn(['valid' => true, 'sanitized' => 'Clean desc']);

		$result = $this->subject->callValidateInputs([
			'title' => ['value' => 'My Name', 'type' => 'name', 'required' => true],
			'desc' => ['value' => 'Some desc', 'type' => 'description'],
		]);

		$this->assertTrue($result['valid']);
		$this->assertEmpty($result['errors']);
		$this->assertSame('Clean Name', $result['sanitized']['title']);
		$this->assertSame('Clean desc', $result['sanitized']['desc']);
	}

	public function testValidateInputsWithErrors(): void {
		$this->validator->method('validateName')
			->willReturn(['valid' => false, 'error' => 'Name too long']);
		$this->validator->method('validateAmount')
			->willReturn(['valid' => false, 'error' => 'Amount must be positive']);

		$result = $this->subject->callValidateInputs([
			'name' => ['value' => str_repeat('x', 300), 'type' => 'name', 'required' => true],
			'price' => ['value' => -5, 'type' => 'amount', 'required' => true],
		]);

		$this->assertFalse($result['valid']);
		$this->assertCount(2, $result['errors']);
		$this->assertSame('Name too long', $result['errors']['name']);
		$this->assertSame('Amount must be positive', $result['errors']['price']);
		$this->assertEmpty($result['sanitized']);
	}

	public function testValidateInputsMixedValidAndInvalid(): void {
		$this->validator->method('validateName')
			->willReturn(['valid' => true, 'sanitized' => 'OK Name']);
		$this->validator->method('validateColor')
			->willReturn(['valid' => false, 'error' => 'Invalid color']);

		$result = $this->subject->callValidateInputs([
			'name' => ['value' => 'OK Name', 'type' => 'name'],
			'color' => ['value' => 'xyz', 'type' => 'color'],
		]);

		$this->assertFalse($result['valid']);
		$this->assertCount(1, $result['errors']);
		$this->assertSame('OK Name', $result['sanitized']['name']);
	}

	public function testValidateInputsNotes(): void {
		$this->validator->method('validateNotes')
			->willReturn(['valid' => true, 'sanitized' => 'Clean notes']);

		$result = $this->subject->callValidateInputs([
			'notes' => ['value' => 'Some notes', 'type' => 'notes'],
		]);

		$this->assertTrue($result['valid']);
		$this->assertSame('Clean notes', $result['sanitized']['notes']);
	}

	public function testValidateInputsVendor(): void {
		$this->validator->method('validateVendor')
			->willReturn(['valid' => true, 'sanitized' => 'ACME']);

		$result = $this->subject->callValidateInputs([
			'vendor' => ['value' => 'ACME', 'type' => 'vendor'],
		]);

		$this->assertTrue($result['valid']);
		$this->assertSame('ACME', $result['sanitized']['vendor']);
	}

	public function testValidateInputsReference(): void {
		$this->validator->method('validateReference')
			->willReturn(['valid' => true, 'sanitized' => 'REF-001']);

		$result = $this->subject->callValidateInputs([
			'ref' => ['value' => 'REF-001', 'type' => 'reference'],
		]);

		$this->assertTrue($result['valid']);
		$this->assertSame('REF-001', $result['sanitized']['ref']);
	}

	public function testValidateInputsPattern(): void {
		$this->validator->method('validatePattern')
			->willReturn(['valid' => true, 'sanitized' => 'PAT*']);

		$result = $this->subject->callValidateInputs([
			'pat' => ['value' => 'PAT*', 'type' => 'pattern', 'required' => true],
		]);

		$this->assertTrue($result['valid']);
		$this->assertSame('PAT*', $result['sanitized']['pat']);
	}

	public function testValidateInputsIcon(): void {
		$this->validator->method('validateIcon')
			->willReturn(['valid' => true, 'sanitized' => 'icon-home']);

		$result = $this->subject->callValidateInputs([
			'icon' => ['value' => 'icon-home', 'type' => 'icon'],
		]);

		$this->assertTrue($result['valid']);
		$this->assertSame('icon-home', $result['sanitized']['icon']);
	}

	public function testValidateInputsDate(): void {
		$this->validator->method('validateDate')
			->willReturn(['valid' => true, 'sanitized' => '2026-01-01']);

		$result = $this->subject->callValidateInputs([
			'startDate' => ['value' => '2026-01-01', 'type' => 'date', 'required' => true],
		]);

		$this->assertTrue($result['valid']);
		$this->assertSame('2026-01-01', $result['sanitized']['startDate']);
	}

	public function testValidateInputsCurrency(): void {
		$this->validator->method('validateCurrency')
			->willReturn(['valid' => true, 'sanitized' => 'USD']);

		$result = $this->subject->callValidateInputs([
			'currency' => ['value' => 'USD', 'type' => 'currency'],
		]);

		$this->assertTrue($result['valid']);
		$this->assertSame('USD', $result['sanitized']['currency']);
	}

	public function testValidateInputsAccountType(): void {
		$this->validator->method('validateAccountType')
			->willReturn(['valid' => true, 'sanitized' => 'checking']);

		$result = $this->subject->callValidateInputs([
			'type' => ['value' => 'checking', 'type' => 'accountType'],
		]);

		$this->assertTrue($result['valid']);
		$this->assertSame('checking', $result['sanitized']['type']);
	}

	public function testValidateInputsDefaultTypeWithMaxLength(): void {
		$this->validator->method('validateStringLength')
			->willReturn(['valid' => true, 'sanitized' => 'short']);

		$result = $this->subject->callValidateInputs([
			'code' => ['value' => 'short', 'type' => 'unknown_type', 'maxLength' => 10],
		]);

		$this->assertTrue($result['valid']);
		$this->assertSame('short', $result['sanitized']['code']);
	}

	public function testValidateInputsDefaultTypeNoMaxLength(): void {
		$result = $this->subject->callValidateInputs([
			'misc' => ['value' => 'anything', 'type' => 'unknown_type'],
		]);

		$this->assertTrue($result['valid']);
		$this->assertSame('anything', $result['sanitized']['misc']);
	}

	public function testValidateInputsUsesFormattedFallback(): void {
		$this->validator->method('validateDate')
			->willReturn(['valid' => true, 'formatted' => '2026-03-10']);

		$result = $this->subject->callValidateInputs([
			'date' => ['value' => '3/10/2026', 'type' => 'date'],
		]);

		$this->assertTrue($result['valid']);
		$this->assertSame('2026-03-10', $result['sanitized']['date']);
	}

	public function testValidateInputsCurrencyNullCoalesces(): void {
		$this->validator->method('validateCurrency')
			->willReturn(['valid' => true, 'sanitized' => '']);

		$result = $this->subject->callValidateInputs([
			'currency' => ['type' => 'currency'],
		]);

		$this->assertTrue($result['valid']);
	}

	public function testValidateInputsAccountTypeNullCoalesces(): void {
		$this->validator->method('validateAccountType')
			->willReturn(['valid' => true, 'sanitized' => '']);

		$result = $this->subject->callValidateInputs([
			'type' => ['type' => 'accountType'],
		]);

		$this->assertTrue($result['valid']);
	}

	// ── validationErrorResponse ────────────────────────────────────

	public function testValidationErrorResponseSingleError(): void {
		$response = $this->subject->callValidationErrorResponse([
			'name' => 'Name is required',
		]);

		$this->assertSame(Http::STATUS_BAD_REQUEST, $response->getStatus());
		$this->assertSame('Name is required', $response->getData()['error']);
		$this->assertCount(1, $response->getData()['validation_errors']);
	}

	public function testValidationErrorResponseMultipleErrors(): void {
		$response = $this->subject->callValidationErrorResponse([
			'name' => 'Name is required',
			'amount' => 'Amount must be positive',
		]);

		$this->assertSame(Http::STATUS_BAD_REQUEST, $response->getStatus());
		$this->assertSame('Validation failed', $response->getData()['error']);
		$this->assertCount(2, $response->getData()['validation_errors']);
	}

	// ── validateNameInput ──────────────────────────────────────────

	public function testValidateNameInputValid(): void {
		$this->validator->method('validateName')
			->willReturn(['valid' => true, 'sanitized' => 'Good Name']);

		$result = $this->subject->callValidateNameInput('Good Name');
		$this->assertNull($result);
	}

	public function testValidateNameInputInvalid(): void {
		$this->validator->method('validateName')
			->willReturn(['valid' => false, 'error' => 'Name too long']);

		$result = $this->subject->callValidateNameInput(str_repeat('x', 300));
		$this->assertSame(Http::STATUS_BAD_REQUEST, $result->getStatus());
		$this->assertSame('Name too long', $result->getData()['error']);
	}

	public function testValidateNameInputNotRequired(): void {
		$this->validator->method('validateName')
			->willReturn(['valid' => true, 'sanitized' => null]);

		$result = $this->subject->callValidateNameInput(null, false);
		$this->assertNull($result);
	}

	// ── validateDescriptionInput ───────────────────────────────────

	public function testValidateDescriptionInputValid(): void {
		$this->validator->method('validateDescription')
			->willReturn(['valid' => true, 'sanitized' => 'A description']);

		$result = $this->subject->callValidateDescriptionInput('A description');
		$this->assertNull($result);
	}

	public function testValidateDescriptionInputInvalid(): void {
		$this->validator->method('validateDescription')
			->willReturn(['valid' => false, 'error' => 'Description too long']);

		$result = $this->subject->callValidateDescriptionInput(str_repeat('x', 5000));
		$this->assertSame(Http::STATUS_BAD_REQUEST, $result->getStatus());
		$this->assertSame('Description too long', $result->getData()['error']);
	}

	// ── validateAmountInput ────────────────────────────────────────

	public function testValidateAmountInputValid(): void {
		$this->validator->method('validateAmount')
			->willReturn(['valid' => true, 'sanitized' => 42.50]);

		$result = $this->subject->callValidateAmountInput(42.50);
		$this->assertNull($result);
	}

	public function testValidateAmountInputInvalid(): void {
		$this->validator->method('validateAmount')
			->willReturn(['valid' => false, 'error' => 'Amount is required']);

		$result = $this->subject->callValidateAmountInput(null, 'Price', true);
		$this->assertSame(Http::STATUS_BAD_REQUEST, $result->getStatus());
		$this->assertSame('Amount is required', $result->getData()['error']);
	}

	public function testValidateAmountInputNotRequired(): void {
		$this->validator->method('validateAmount')
			->willReturn(['valid' => true, 'sanitized' => null]);

		$result = $this->subject->callValidateAmountInput(null, 'Price', false);
		$this->assertNull($result);
	}
}

/**
 * Concrete class that uses InputValidationTrait for testing.
 * Exposes protected methods via public wrappers.
 */
class InputValidationTraitTestClass {
	use InputValidationTrait;

	public function callSetInputValidator(ValidationService $v): void {
		$this->setInputValidator($v);
	}

	public function callGetInputValidator(): ValidationService {
		return $this->getInputValidator();
	}

	public function callValidateInputs(array $validations): array {
		return $this->validateInputs($validations);
	}

	public function callValidationErrorResponse(array $errors): \OCP\AppFramework\Http\DataResponse {
		return $this->validationErrorResponse($errors);
	}

	public function callValidateNameInput(?string $name, bool $required = true): ?\OCP\AppFramework\Http\DataResponse {
		return $this->validateNameInput($name, $required);
	}

	public function callValidateDescriptionInput(?string $description): ?\OCP\AppFramework\Http\DataResponse {
		return $this->validateDescriptionInput($description);
	}

	public function callValidateAmountInput(mixed $amount, string $fieldName = 'Amount', bool $required = true): ?\OCP\AppFramework\Http\DataResponse {
		return $this->validateAmountInput($amount, $fieldName, $required);
	}
}
