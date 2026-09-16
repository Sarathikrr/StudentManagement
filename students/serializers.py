from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Student
        fields = '__all__'

    def validate_name(self, value):
        if not value.replace(" ", "").isalpha():
            raise serializers.ValidationError(
                "Name should contain only letters."
            )
        return value

    def validate_age(self, value):
        if value < 16 or value > 100:
            raise serializers.ValidationError(
                "Age must be between 16 and 100."
            )
        return value

    def validate_phone(self, value):
        if not value.isdigit():
            raise serializers.ValidationError(
                "Phone number should contain only digits."
            )

        if len(value) != 10:
            raise serializers.ValidationError(
                "Phone number must contain 10 digits."
            )

        return value