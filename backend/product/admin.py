from django.contrib import admin
from .models import Product, ShoppingCart

class ShoppingCartModelAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price")

admin.site.register(Product)
admin.site.register(ShoppingCart, ShoppingCartModelAdmin)